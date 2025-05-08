import { UserDto } from '@src/users/dto/user.dto';
import { Comment } from '../entities/comment.entity';
import { FindOptionsRelations } from 'typeorm';

export class CommentDto {
  id: string;
  content: string;
  createdAt: Date;
  author: UserDto;

  static fromEntity(comment: Comment): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: UserDto.fromEntity(comment.author),
    };
  }

  static getRelations(): FindOptionsRelations<Comment> {
    return {
      author: true,
    };
  }
}
