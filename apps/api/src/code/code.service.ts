import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CodeFilterWithAuthorIdDto } from './dto/code-filter-with-author-id.dto';
import { CodeFilterDto } from './dto/code-filter.dto';
import { CodeDto } from './dto/code.dto';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { Code } from './entities/code.entity';
import { truncateCodeContent } from './utils/truncate-code-content';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
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

  async findAllPublic(filter?: CodeFilterWithAuthorIdDto): Promise<CodeDto[]> {
    const codes = await this.codeRepository.find({
      relations: { authorUser: true },
      where: {
        private: false,
        language: filter?.language ? In(filter.language) : undefined,
        name: filter?.name ? Like(`%${filter.name}%`) : undefined,
        authorUser: filter?.authorId ? { id: filter.authorId } : undefined,
      },
    });

    return codes.map((code) => {
      const modifiedCode = { ...code };
      modifiedCode.content = truncateCodeContent(modifiedCode.content);
      return CodeDto.fromEntity(modifiedCode);
    });
  }

  async findCodesByAuthorId(
    authorId: string,
    filter: CodeFilterDto,
  ): Promise<CodeDto[]> {
    const codes = await this.codeRepository.find({
      relations: { authorUser: true },
      where: {
        language: filter?.language ? In(filter.language) : undefined,
        name: filter?.name ? Like(`%${filter.name}%`) : undefined,
        authorUser: { id: authorId },
      },
    });

    return codes.map((code) => CodeDto.fromEntity(code));
  }

  async findById(id: string): Promise<CodeDto | null> {
    const code = await this.codeRepository.findOne({
      where: { id },
      relations: { authorUser: true },
    });

    if (!code) return null;

    return CodeDto.fromEntity(code);
  }

  async update(id: string, updateCodeDto: UpdateCodeDto): Promise<void> {
    await this.codeRepository.update(id, updateCodeDto);
  }

  remove(id: string) {
    return this.codeRepository.delete(id);
  }
}
