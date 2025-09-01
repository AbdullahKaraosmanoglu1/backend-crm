import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './presentation/http/users.controller';
import { CreateUserHandler } from './application/handlers/commands/create-user.handler';
import { GetUserHandler } from './application/handlers/queries/get-user.handler';
import { UserPrismaRepository } from './infrastructure/persistence/user.prisma-repository';
import { PasswordHasherService } from './domain/services/password-hasher.service';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    GetUserHandler,
    UserPrismaRepository,
    PasswordHasherService,
  ],
  exports: [PasswordHasherService], // <- EKLENDİ
})
export class UsersModule { }
