import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from 'application/handlers/queries/get-user.query';
import type { IUserRepository } from '../../ports/user-repository.port'; // <-- type import

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
  ) { }

  async execute(query: GetUserQuery) {
    return this.users.findById(query.id);
  }
}
