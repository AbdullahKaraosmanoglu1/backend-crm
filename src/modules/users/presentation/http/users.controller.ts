import { Body, Controller, Get, Param, Post, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { JwtAuthGuard } from '../../../../shared/security/jwt-auth.guard';
import { GetUsersQuery } from '../../../../modules/users/application/queries/get-users.query';
import { GetUsersQueryDto, Paginated, UserResponseDto } from './dto/get-users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.commandBus.execute(
      new CreateUserCommand(
        dto.email,
        dto.password,
        dto.firstName ?? '',  // undefined olursa '' geçer
        dto.lastName ?? '',
      ),
    );
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }
  @Get()
  async getUsers(
    @Query() dto: GetUsersQueryDto,
  ): Promise<Paginated<UserResponseDto>> {
    const page = dto.page ?? 1;
    const pageSize = Math.min(Math.max(dto.pageSize ?? 20, 1), 100);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const result = await this.queryBus.execute(
      new GetUsersQuery(dto.search ?? undefined, skip, take),
    );

    // result zaten { items, total, skip, take } formatında gelecek
    return {
      items: result.items as UserResponseDto[],
      total: result.total,
      page,
      pageSize: take,
    };
  }
}
