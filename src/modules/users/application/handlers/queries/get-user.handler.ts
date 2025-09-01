import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../../queries/get-user.query';
import { User } from '../../../domain/entities/user.entity';
import { UserPrismaRepository } from '../../../infrastructure/persistence/user.prisma-repository';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly repo: UserPrismaRepository) {}

  async execute(query: GetUserQuery): Promise<User | null> {
    return this.repo.findById(query.id);
  }
}
