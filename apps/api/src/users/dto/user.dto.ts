import { User } from '../entities/user.entity';

export class UserDto {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  lastLoginAt: Date;

  avatarUrl: string | null;

  name: string;

  email: string | null;

  static fromEntity(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    dto.lastLoginAt = user.lastLoginAt;
    dto.avatarUrl = user.avatarUrl;
    dto.name = user.name;
    dto.email = user.email;
    return dto;
  }
}
