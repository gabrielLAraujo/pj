import { Body, Controller, Post, Request, UseGuards, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('github')
  getGitHubAuthUrl(@Query('redirect_uri') redirectUri?: string) {
    return this.authService.getGitHubAuthUrl(redirectUri);
  }

  @Post('github/callback')
  async handleGitHubCallback(@Body() body: { code: string; state?: string }) {
    return this.authService.handleGitHubCallback(body.code, body.state);
  }

  @Post('google/callback')
  async handleGoogleCallback(@Body() body: { token: string }) {
    return this.authService.handleGoogleCallback(body.token);
  }

  @Post('verify')
  async verifyToken(@Body() body: { token: string }) {
    return this.authService.verifyToken(body.token);
  }
}
