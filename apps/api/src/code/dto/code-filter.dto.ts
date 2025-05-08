import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CodeLanguage } from '../enum/code-language.enum';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { Code } from '../entities/code.entity';

export class CodeFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    return [value as CodeLanguage];
  })
  language?: CodeLanguage[];

  @IsOptional()
  name?: string;

  toWhere(): FindOptionsWhere<Code> {
    const where: FindOptionsWhere<Code> = {};

    if (this.language) where.language = In(this.language);
    if (this.name) where.name = ILike(`%${this.name}%`);

    return where;
  }
}
