import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
  async getAll(@Query() q: GetUsersQueryDto): Promise<Paginated<UserResponseDto>> {
    return this.queryBus.execute(new GetUsersQuery(q.search, q.page, q.pageSize));
  }
}
