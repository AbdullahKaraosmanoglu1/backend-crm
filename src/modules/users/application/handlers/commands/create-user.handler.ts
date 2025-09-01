import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../commands/create-user.command';
import { User } from '../../../domain/entities/user.entity';
import { randomUUID } from 'crypto';
import { UserPrismaRepository } from '../../../infrastructure/persistence/user.prisma-repository';
import { PasswordHasherService } from '../../../domain/services/password-hasher.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repo: UserPrismaRepository,
    private readonly hasher: PasswordHasherService,
  ) { }

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, password, firstName, lastName } = command;

    const hashed = await this.hasher.hash(password);

    const user = new User(randomUUID(), email, hashed, firstName, lastName);

    return this.repo.create(user);
  }
}
