// src/modules/users/application/handlers/queries/get-user.handler.ts
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// ✅ DOĞRU YOL
import { GetUserQuery } from '../../queries/get-user.query';

// ✅ TOKEN + type import
import { USER_REPOSITORY, type IUserRepository } from '../../ports/user-repository.port';

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
