import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LogService } from '../log/log.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logService: LogService, // Assuming LogService is injected for logging purposes
  ) {
      this.logService.log('AuthService initialized');
  }

async validateUser(email: string, password: string): Promise<any> {
  const user = await this.userService.findByEmail(email);
  this.logService.log(`Validating user with email: ${email}`);
  if (!user) {
    return null;
  }

  if (!user.password) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return null;
  }

  const { password: _, ...result } = user;
  this.logService.log(`User validated: ${user.email}`);
  return result;
}



  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    this.logService.log(`User logged in: ${user.email}`);
    return {
        access_token: this.jwtService.sign(payload),
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        loggedIn: true,
        message: 'Login successful',
    };
  }
  async register(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.login(user);
  }

  async handleGitHubCallback(code: string, state?: string) {
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        state,
      }, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        throw new HttpException('Failed to get access token from GitHub', HttpStatus.BAD_REQUEST);
      }

      // Get user info from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${access_token}`,
        },
      });

      const githubUser = userResponse.data;

      // Get user email if not public
      let email = githubUser.email;
      if (!email) {
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `token ${access_token}`,
          },
        });
        const primaryEmail = emailResponse.data.find((e: any) => e.primary);
        email = primaryEmail?.email;
      }

      if (!email) {
        throw new HttpException('Unable to get email from GitHub', HttpStatus.BAD_REQUEST);
      }

      // Find or create user
      let user = await this.userService.findByEmail(email);
      
      if (!user) {
        // Create new user
        user = await this.userService.create({
          email,
          name: githubUser.name || githubUser.login,
          password: null, // OAuth users don't have passwords
          provider: 'github',
          providerId: githubUser.id.toString(),
          avatar: githubUser.avatar_url,
        });
      }

      // Generate JWT token
      const payload = { username: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      this.logService.log(`GitHub OAuth login successful: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: githubUser.avatar_url,
          provider: 'github',
        },
      };
    } catch (error) {
      this.logService.log(`GitHub OAuth error: ${error.message}`);
      throw new HttpException(
        error.response?.data?.error_description || 'GitHub authentication failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async handleGoogleCallback(token: string) {
    try {
      // Verify Google token
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`);
      const googleUser = response.data;

      if (!googleUser.email) {
        throw new HttpException('Unable to get email from Google', HttpStatus.BAD_REQUEST);
      }

      // Find or create user
      let user = await this.userService.findByEmail(googleUser.email);
      
      if (!user) {
        // Create new user
        user = await this.userService.create({
          email: googleUser.email,
          name: googleUser.name,
          password: null, // OAuth users don't have passwords
          provider: 'google',
          providerId: googleUser.id,
          avatar: googleUser.picture,
        });
      }

      // Generate JWT token
      const payload = { username: user.email, sub: user.id };
      const jwtToken = this.jwtService.sign(payload);

      this.logService.log(`Google OAuth login successful: ${user.email}`);

      return {
        token: jwtToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: googleUser.picture,
          provider: 'google',
        },
      };
    } catch (error) {
      this.logService.log(`Google OAuth error: ${error.message}`);
      throw new HttpException(
        'Google authentication failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  getGitHubAuthUrl(redirectUri?: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirect = redirectUri || process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/auth/callback';
    const scope = 'user:email';
    const state = Math.random().toString(36).substring(2, 15);

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=${scope}&state=${state}`;
    
    return {
      url,
      state,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findById(decoded.sub);
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      return {
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
