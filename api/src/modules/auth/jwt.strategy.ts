import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '4dkNeHp/vvUfZAwmvD8F73s1kGWJIWo3hlpPWGGK2nU=', // Ensure this is set in your environment variables
    });
  }

  async validate(payload: any) {
        console.log('[JWT STRATEGY] Payload recebido:', payload);
    return { userId: payload.sub, email: payload.username };
  }
}
