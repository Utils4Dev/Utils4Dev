import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ReactionType } from '../enum/reaction-type.enum';
import { Code } from './code.entity';

@Entity()
@Unique(['code', 'user'])
export class CodeReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReactionType })
  type: ReactionType;

  @ManyToOne(() => Code, (code) => code.reactions, { onDelete: 'CASCADE' })
  code: Code;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
