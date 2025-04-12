import { ApiProperty } from '@nestjs/swagger';
import { Code } from '../entities/code.entity';
import { ReactionType } from '../enum/reaction-type.enum';
import { CodeDto } from './code.dto';

type CodeReaction = {
  length: number;
  userReacted: boolean;
};

export class CodeWithReactionsDto extends CodeDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        length: { type: 'number' },
        userReacted: { type: 'boolean' },
      },
    },
  })
  reactions: Record<ReactionType, CodeReaction>;

  static fromEntity(entity: Code, userId?: string): CodeWithReactionsDto {
    const dto = super.fromEntity(entity) as CodeWithReactionsDto;

    const reactions = Object.values(ReactionType).reduce(
      (acc, type) => {
        acc[type] = {
          length: 0,
          userReacted: false,
        };
        return acc;
      },
      {} as Record<ReactionType, CodeReaction>,
    );
    for (const reaction of entity.reactions) {
      const type = reaction.type;

      reactions[type].length++;

      if (reaction.user.id === userId) {
        reactions[type].userReacted = true;
      }
    }
    dto.reactions = reactions;

    return dto;
  }
}
