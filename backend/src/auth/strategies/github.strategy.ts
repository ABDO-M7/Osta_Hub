import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function,
    ) {
        const { id, displayName, username, emails, photos } = profile;
        const email = emails?.[0]?.value || `${username}@github.local`;
        const user = await this.authService.findOrCreateOAuthUser({
            provider: 'github',
            providerId: String(id),
            email,
            name: displayName || username,
            avatar: photos?.[0]?.value,
        });
        done(null, user);
    }
}
