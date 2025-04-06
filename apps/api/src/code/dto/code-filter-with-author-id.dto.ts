import { IsOptional } from 'class-validator';
import { CodeFilterDto } from './code-filter.dto';

export class CodeFilterWithAuthorIdDto extends CodeFilterDto {
  @IsOptional()
  authorId?: string;
}
