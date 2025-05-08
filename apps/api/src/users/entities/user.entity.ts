import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GithubProvider } from '../entities/github-provider.entity';
import { Code } from 'src/code/entities/code.entity';
import { Comment } from 'src/code/entities/comment.entity';
import { Bookmark } from 'src/code/entities/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastLoginAt: Date;

  @Column('text', { nullable: true })
  avatarUrl: string | null;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  email: string | null;

  @OneToMany(() => Code, (code) => code.authorUser)
  codes: Code[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToOne(() => GithubProvider, (githubProvider) => githubProvider.user)
  githubProvider: GithubProvider;
}
