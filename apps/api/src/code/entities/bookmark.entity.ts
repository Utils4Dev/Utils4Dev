import { User } from 'src/users/entities/user.entity';
import { Code } from './code.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['user', 'code'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Code, { onDelete: 'CASCADE' })
  code: Code;
}
