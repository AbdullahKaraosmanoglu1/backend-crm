import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../commands/create-user.command';

import { USER_REPOSITORY, type IUserRepository } from '../../ports/user-repository.port'; // <-- type import
import { User } from '../../../domain/entities/user.entity';
// (Parola hashleme gibi servisleri ayrı shared’dan alıyorsan ekle)

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) { }

  async execute(cmd: CreateUserCommand) {
    // örnek: email benzersiz mi?
    const exists = await this.users.findByEmail(cmd.email);
    if (exists) {
      throw new Error('Email already in use');
    }

    // password hash işlemini burada ya da domain service’de yap
    const user = new User({
      id: crypto.randomUUID(),          // veya domain factory
      email: cmd.email,
      firstName: cmd.firstName ?? null,
      lastName: cmd.lastName ?? null,
      passwordHash: cmd.passwordHash,   // dışarıda hash’lenmiş ise
    });

    return this.users.create(user);
  }
}
