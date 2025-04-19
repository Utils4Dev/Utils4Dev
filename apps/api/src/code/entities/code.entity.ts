import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CodeLanguage } from '../enum/code-language.enum';
import { User } from 'src/users/entities/user.entity';
import { CodeReaction } from './code-reaction.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';

@Entity()
export class Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CodeLanguage })
  language: CodeLanguage;

  @Column({ default: '' })
  content: string;

  @Column()
  private: boolean;

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.codes)
  authorUser: User;

  @OneToMany(() => CodeReaction, (reaction) => reaction.code)
  reactions: CodeReaction[];

  @OneToMany(() => Comment, (comment) => comment.code)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.code)
  bookmarks: Bookmark[];
}
