import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from '../enum/reaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddCodeReactionDto {
  @IsEnum(ReactionType)
  @IsNotEmpty()
  @ApiProperty({ enum: ReactionType, enumName: 'ReactionType' })
  type: ReactionType;
}
