import { IsOptional } from 'class-validator';
import { CodeFilterDto } from './code-filter.dto';
import { FindOptionsWhere } from 'typeorm';
import { Code } from '../entities/code.entity';

export class CodeFilterWithAuthorIdDto extends CodeFilterDto {
  @IsOptional()
  authorId?: string;

  toWhere(): FindOptionsWhere<Code> {
    const where: FindOptionsWhere<Code> = super.toWhere();

    if (this.authorId) where.authorUser = { id: this.authorId };

    return where;
  }
}
