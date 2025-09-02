// src/modules/users/application/handlers/commands/create-user.handler.ts
import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../commands/create-user.command';
import { USER_REPOSITORY, type IUserRepository } from '../../ports/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { PasswordHasherService } from '../../../../../shared/security/password-hasher.service'; // <-- ekle
import * as crypto from 'node:crypto';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    private readonly hasher: PasswordHasherService,               // <-- enjekte
  ) { }

  async execute(cmd: CreateUserCommand) {
    const exists = await this.users.findByEmail(cmd.email);
    if (exists) throw new ConflictException('Email already in use');

    // HER ZAMAN bcrypt ile hashle
    const passwordHash = await this.hasher.hash(cmd.password);

    const user = new User(
      crypto.randomUUID(),
      cmd.email,
      passwordHash,
      cmd.firstName ?? null,
      cmd.lastName ?? null,
    );

    return this.users.create(user);
  }
}
