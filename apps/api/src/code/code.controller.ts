import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt.guard';
import { AuthUser } from 'src/users/decorators/user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { CodeService } from './code.service';
import { AddCodeReactionDto } from './dto/add-code-reaction.dto';
import { CodeFilterWithAuthorIdDto } from './dto/code-filter-with-author-id.dto';
import { CodeFilterDto } from './dto/code-filter.dto';
import { CommentDto } from './dto/comment.dto';
import { CreateCodeDto } from './dto/create-code.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCodeDto } from './dto/update-code.dto';

@Controller('codes')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCode(@Body() createCodeDto: CreateCodeDto, @AuthUser() user: UserDto) {
    return this.codeService.create(createCodeDto, user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAllPublicCodes(
    @Query() filter: CodeFilterWithAuthorIdDto,
    @AuthUser() user?: UserDto,
  ) {
    return this.codeService.findAllPublic(user.id, filter);
  }

  @Get('my-codes')
  @UseGuards(JwtAuthGuard)
  async findMyCodes(@Query() filter: CodeFilterDto, @AuthUser() user: UserDto) {
    return this.codeService.findCodesByAuthorId(user.id, user.id, filter);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findCodeById(@Param('id') id: string, @AuthUser() user?: UserDto) {
    const code = await this.codeService.findById(id, user?.id);
    if (!code) throw new NotFoundException('Code not found');

    if (code.private && code.author.id !== user?.id)
      throw new NotFoundException('Code not found');

    return code;
  }

  @Post(':id/reaction')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addReactionToCodeById(
    @Param('id') codeId: string,
    @Body() reaction: AddCodeReactionDto,
    @AuthUser() user: UserDto,
  ) {
    const code = await this.codeService.findById(codeId);
    if (!code) throw new NotFoundException('Code not found');

    await this.codeService.addReactionToCodeById(
      codeId,
      user.id,
      reaction.type,
    );
  }

  @Delete(':id/reaction')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReactionToCodeById(
    @Param('id') codeId: string,
    @AuthUser() user: UserDto,
  ) {
    const code = await this.codeService.findById(codeId);
    if (!code) throw new NotFoundException('Code not found');

    await this.codeService.removeReactionFromCodeById(codeId, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCodeById(
    @Param('id') id: string,
    @Body() updateCodeDto: UpdateCodeDto,
    @AuthUser() user: UserDto,
  ) {
    const code = await this.codeService.findById(id);
    if (!code) throw new NotFoundException('Code not found');

    if (code.author.id !== user.id)
      throw new NotFoundException('Code not found');

    return await this.codeService.update(id, updateCodeDto);
  }

  @Delete(':id')
  deleteCodeById(@Param('id') id: string) {
    return this.codeService.removeCodeById(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addCommentToCode(
    @Param('id') codeId: string,
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: UserDto,
  ): Promise<CommentDto> {
    return this.codeService.addCommentToCode(codeId, user.id, createCommentDto);
  }

  @Get(':id/comments')
  async commentsByCodeId(@Param('id') codeId: string): Promise<CommentDto[]> {
    return this.codeService.getCommentsByCodeId(codeId);
  }

  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async addBookmarkByCodeId(
    @Param('id') codeId: string,
    @AuthUser() user: UserDto,
  ) {
    await this.codeService.addBookmark(user.id, codeId);
  }

  @Delete(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBookmarkByCodeId(
    @Param('id') codeId: string,
    @AuthUser() user: UserDto,
  ) {
    await this.codeService.removeBookmark(user.id, codeId);
  }

  @Get('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getBookmarkCodes(
    @AuthUser() user: UserDto,
    @Query() filter?: CodeFilterDto,
  ) {
    return await this.codeService.getBookmarkCodes(user.id, filter);
  }
}
