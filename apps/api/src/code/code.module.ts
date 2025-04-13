import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { Code } from './entities/code.entity';
import { CodeReaction } from './entities/code-reaction.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Code, CodeReaction, Comment])],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
