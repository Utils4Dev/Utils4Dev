import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CodeFilterWithAuthorIdDto } from './dto/code-filter-with-author-id.dto';
import { CodeFilterDto } from './dto/code-filter.dto';
import { CodeWithReactionsAndBookMarkDto } from './dto/code-with-reactions-and-book-mark.dto';
import { CodeDto } from './dto/code.dto';
import { CommentDto } from './dto/comment.dto';
import { CreateCodeDto } from './dto/create-code.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Bookmark } from './entities/bookmark.entity';
import { CodeReaction } from './entities/code-reaction.entity';
import { Code } from './entities/code.entity';
import { Comment } from './entities/comment.entity';
import { ReactionType } from './enum/reaction-type.enum';
import { truncateCodeContent } from './utils/truncate-code-content';

@Injectable()
export class CodeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
    @InjectRepository(CodeReaction)
    private codeReactionRepository: Repository<CodeReaction>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
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
  ): Promise<CodeWithReactionsAndBookMarkDto[]> {
    const codes = await this.codeRepository.find({
      relations: CodeWithReactionsAndBookMarkDto.getRelations(),
      order: { createdAt: 'DESC' },
      where: {
        ...filter.toWhere(),
        private: false,
      },
    });

    return codes.map((code) => {
      const modifiedCode = { ...code };
      modifiedCode.content = truncateCodeContent(modifiedCode.content);
      return CodeWithReactionsAndBookMarkDto.fromEntity(modifiedCode, userId);
    });
  }

  async findCodesByAuthorId(
    authorId: string,
    userId?: string,
    filter?: CodeFilterDto,
  ): Promise<CodeWithReactionsAndBookMarkDto[]> {
    const codes = await this.codeRepository.find({
      relations: CodeWithReactionsAndBookMarkDto.getRelations(),
      order: { createdAt: 'DESC' },
      where: {
        ...filter.toWhere(),
        authorUser: { id: authorId },
      },
    });

    return codes.map((code) =>
      CodeWithReactionsAndBookMarkDto.fromEntity(code, userId),
    );
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<CodeWithReactionsAndBookMarkDto | null> {
    const code = await this.codeRepository.findOne({
      relations: CodeWithReactionsAndBookMarkDto.getRelations(),
      where: { id },
    });

    if (!code) return null;

    return CodeWithReactionsAndBookMarkDto.fromEntity(code, userId);
  }

  async update(id: string, updateCodeDto: UpdateCodeDto): Promise<CodeDto> {
    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(Code, id, updateCodeDto);

        return await transactionalEntityManager.findOneOrFail(Code, {
          where: { id },
          relations: CodeDto.getRelations(),
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

  async addCommentToCode(
    codeId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      code: { id: codeId },
      author: { id: userId },
    });

    await this.commentRepository.save(comment);
    return CommentDto.fromEntity(comment);
  }

  async getCommentsByCodeId(codeId: string): Promise<CommentDto[]> {
    const comments = await this.commentRepository.find({
      relations: CommentDto.getRelations(),
      where: { code: { id: codeId } },
      order: { createdAt: 'DESC' },
    });

    return comments.map((c) => CommentDto.fromEntity(c));
  }

  async addBookmark(userId: string, codeId: string) {
    await this.bookmarkRepository.upsert(
      { user: { id: userId }, code: { id: codeId } },
      ['user', 'code'],
    );
  }

  async removeBookmark(userId: string, codeId: string) {
    await this.bookmarkRepository.delete({
      user: { id: userId },
      code: { id: codeId },
    });
  }

  async getBookmarkCodes(
    userId: string,
    filter?: CodeFilterWithAuthorIdDto,
  ): Promise<CodeWithReactionsAndBookMarkDto[]> {
    const codes = await this.codeRepository.find({
      relations: CodeWithReactionsAndBookMarkDto.getRelations(),
      order: { createdAt: 'DESC' },
      where: {
        ...filter.toWhere(),
        bookmarks: { user: { id: userId } },
      },
    });

    return codes.map((code) => {
      const modifiedCode = { ...code };
      modifiedCode.content = truncateCodeContent(modifiedCode.content);
      return CodeWithReactionsAndBookMarkDto.fromEntity(modifiedCode);
    });
  }

  async removeCodeById(id: string) {
    await this.codeRepository.delete(id);
  }
}
