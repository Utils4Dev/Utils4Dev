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

  @OneToOne(() => GithubProvider, (githubProvider) => githubProvider.user)
  githubProvider: GithubProvider;
}
