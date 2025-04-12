import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { Code } from '../entities/code.entity';
import { CodeLanguage } from '../enum/code-language.enum';

export class CodeDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  content: string;
  private: boolean;
  author: UserDto;

  @ApiProperty({ enum: CodeLanguage, enumName: 'CodeLanguage' })
  language: CodeLanguage;

  static fromEntity(entity: Code): CodeDto {
    const dto = new CodeDto();

    dto.id = entity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.name = entity.name;
    dto.language = entity.language;
    dto.content = entity.content;
    dto.private = entity.private;
    dto.author = UserDto.fromEntity(entity.authorUser);

    return dto;
  }
}
