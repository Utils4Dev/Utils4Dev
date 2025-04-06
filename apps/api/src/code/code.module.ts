import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { Code } from './entities/code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
