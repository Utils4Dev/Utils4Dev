import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { GithubProvider } from './entities/github-provider.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return null;

    return UserDto.fromEntity(user);
  }

  async findByGithubId(githubId: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({
      githubProvider: { externalId: githubId },
    });
    if (!user) return null;

    return UserDto.fromEntity(user);
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    console.log('Creating user', user);

    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const createUser = transactionalEntityManager.create(User, {
          avatarUrl: user.avatarUrl,
          email: user.email,
          name: user.name,
        });

        const { id: userId } = await transactionalEntityManager.save(
          User,
          createUser,
        );

        await transactionalEntityManager.save(GithubProvider, {
          user: { id: userId },
          externalId: user.githubProvider.externalId,
          login: user.githubProvider.login,
        });

        const createdUser = await transactionalEntityManager.findOneBy(User, {
          id: userId,
        });
        if (!createdUser) throw new Error('Could not create user');

        return createdUser;
      },
    );

    console.log('User created', result);
    return UserDto.fromEntity(result);
  }
}
