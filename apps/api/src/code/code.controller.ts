import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CodeFilterWithAuthorIdDto } from './dto/code-filter-with-author-id.dto';
import { CodeFilterDto } from './dto/code-filter.dto';
import { CreateCodeDto } from './dto/create-code.dto';
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
  findAllPublicCodes(@Query() filter: CodeFilterWithAuthorIdDto) {
    return this.codeService.findAllPublic(filter);
  }

  @Get('my-codes')
  @UseGuards(JwtAuthGuard)
  async findMyCodes(@Query() filter: CodeFilterDto, @AuthUser() user: UserDto) {
    return this.codeService.findCodesByAuthorId(user.id, filter);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findCodeById(@Param('id') id: string, @AuthUser() user?: UserDto) {
    const code = await this.codeService.findById(id);
    if (!code) throw new NotFoundException('Code not found');

    if (code.private && code.author.id !== user?.id)
      throw new NotFoundException('Code not found');

    return code;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCode(
    @Param('id') id: string,
    @Body() updateCodeDto: UpdateCodeDto,
    @AuthUser() user: UserDto,
  ) {
    const code = await this.codeService.findById(id);
    if (!code) throw new NotFoundException('Code not found');

    if (code.author.id !== user.id)
      throw new NotFoundException('Code not found');

    await this.codeService.update(id, updateCodeDto);
  }

  @Delete(':id')
  deleteCodeById(@Param('id') id: string) {
    return this.codeService.remove(id);
  }
}
