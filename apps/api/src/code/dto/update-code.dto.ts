import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
}
