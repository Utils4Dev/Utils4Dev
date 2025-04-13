import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCodeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  private?: boolean;

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
