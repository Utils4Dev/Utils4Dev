import { CreateGithubProviderDto } from './create-github-provider.dto';

export class CreateUserDto {
  avatarUrl: string | null;

  name: string;

  email: string | null;

  githubProvider: CreateGithubProviderDto;
}
