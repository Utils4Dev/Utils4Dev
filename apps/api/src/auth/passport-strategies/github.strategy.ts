import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

const { DOMAIN_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: DOMAIN_URL + '/auth/github/callback',
    });
  }

  async validate(_accessToken, _refreshToken, profile: Profile) {
    console.dir(profile, { depth: null });
    const user = await this.authService.findOrCreateUserGithubProvider(
      profile.id,
      {
        avatarUrl: profile.photos?.[0].value || null,
        email: profile.emails?.[0].value || null,
        name: profile.displayName,
        githubProvider: {
          externalId: profile.id,
          login: profile.username,
        },
      },
    );

    return user;
  }
}
