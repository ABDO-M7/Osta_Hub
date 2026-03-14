import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'dev-secret-key',
            signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
        }),
        UsersModule,
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
    exports: [AuthService],
})
export class AuthModule { }
