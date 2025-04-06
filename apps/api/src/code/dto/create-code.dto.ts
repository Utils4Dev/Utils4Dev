import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CodeLanguage } from '../enum/code-language.enum';

export class CreateCodeDto {
  @IsEnum(CodeLanguage)
  @ApiProperty({ enum: CodeLanguage, enumName: 'CodeLanguage' })
  language: CodeLanguage;

  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  private: boolean;
}
