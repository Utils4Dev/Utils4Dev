import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    type: [String],
    required: false,
    example: ['javascript', 'snippet', 'util'],
  })
  keywords?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
