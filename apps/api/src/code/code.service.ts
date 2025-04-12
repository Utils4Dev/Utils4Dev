import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { CodeFilterWithAuthorIdDto } from './dto/code-filter-with-author-id.dto';
import { CodeFilterDto } from './dto/code-filter.dto';
import { CodeWithReactionsDto } from './dto/code-with-reactions.dto';
import { CodeDto } from './dto/code.dto';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Code } from './entities/code.entity';
import { truncateCodeContent } from './utils/truncate-code-content';
import { ReactionType } from './enum/reaction-type.enum';
import { CodeReaction } from './entities/code-reaction.entity';

@Injectable()
export class CodeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
    @InjectRepository(CodeReaction)
    private codeReactionRepository: Repository<CodeReaction>,
  ) {}

  async create(createCodeDto: CreateCodeDto, userId: string): Promise<CodeDto> {
    const { id } = await this.codeRepository.save({
      ...createCodeDto,
      authorUser: { id: userId },
    });

    const code = await this.findById(id);
    if (!code) throw new Error('Code not found');

    return code;
  }

  async findAllPublic(
    userId?: string,
    filter?: CodeFilterWithAuthorIdDto,
  ): Promise<CodeWithReactionsDto[]> {
    const codes = await this.codeRepository.find({
      relations: { authorUser: true, reactions: { user: true } },
      where: {
        private: false,
        language: filter.language ? In(filter.language) : undefined,
        name: filter.name ? Like(`%${filter.name}%`) : undefined,
        authorUser: filter.authorId ? { id: filter.authorId } : undefined,
      },
    });

    return codes.map((code) => {
      const modifiedCode = { ...code };
      modifiedCode.content = truncateCodeContent(modifiedCode.content);
      return CodeWithReactionsDto.fromEntity(modifiedCode, userId);
    });
  }

  async findCodesByAuthorId(
    authorId: string,
    userId?: string,
    filter?: CodeFilterDto,
  ): Promise<CodeWithReactionsDto[]> {
    const codes = await this.codeRepository.find({
      relations: { authorUser: true, reactions: { user: true } },
      where: {
        language: filter?.language ? In(filter.language) : undefined,
        name: filter?.name ? Like(`%${filter.name}%`) : undefined,
        authorUser: { id: authorId },
      },
    });

    return codes.map((code) => CodeWithReactionsDto.fromEntity(code, userId));
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<CodeWithReactionsDto | null> {
    const code = await this.codeRepository.findOne({
      where: { id },
      relations: { authorUser: true, reactions: { user: true } },
    });

    if (!code) return null;

    return CodeWithReactionsDto.fromEntity(code, userId);
  }

  async update(id: string, updateCodeDto: UpdateCodeDto): Promise<CodeDto> {
    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Code, id, updateCodeDto);

        return await transactionalEntityManager.findOneOrFail(Code, {
          where: { id },
          relations: { authorUser: true, reactions: true },
        });
      },
    );

    return CodeDto.fromEntity(result);
  }

  async addReactionToCodeById(
    codeId: string,
    userId: string,
    reactionType: ReactionType,
  ): Promise<void> {
    await this.codeReactionRepository.upsert(
      {
        code: { id: codeId },
        user: { id: userId },
        type: reactionType,
      },
      ['code', 'user'],
    );
  }

  async removeReactionFromCodeById(
    codeId: string,
    userId: string,
  ): Promise<void> {
    await this.codeReactionRepository.delete({
      code: { id: codeId },
      user: { id: userId },
    });
  }

  remove(id: string) {
    return this.codeRepository.delete(id);
  }
}
