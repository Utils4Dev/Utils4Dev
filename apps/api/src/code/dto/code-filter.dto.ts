import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CodeLanguage } from '../enum/code-language.enum';

export class CodeFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map((v) => v.trim());
    return [value as CodeLanguage];
  })
  language?: CodeLanguage[];

  @IsOptional()
  name?: string;
}
