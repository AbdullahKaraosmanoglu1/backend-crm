import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PrismaModule } from '../../prisma/prisma.module'; // kendi yoluna göre düzelt
import { UsersController } from './presentation/http/users.controller';

import { USER_REPOSITORY } from './application/ports/user-repository.port';
import { CreateUserHandler } from './application/handlers/commands/create-user.handler';
import { GetUserHandler } from './application/handlers/queries/get-user.handler';
import { UserPrismaRepository } from './infrastructure/persistence/user.prisma-repository';

const APPLICATION_HANDLERS = [CreateUserHandler, GetUserHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [UsersController],
  providers: [
    // Port -> Adapter binding
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    ...APPLICATION_HANDLERS,
  ],
  exports: [
    // Başka modüller de (ör. Auth) IUserRepository’ye ulaşsın istiyorsan token’ı export et
    USER_REPOSITORY,
  ],
})
export class UsersModule { }