import { Inject } from '@nestjs/common';
// ⬇️ Token'ı normal import et
import { USER_REPOSITORY } from '../../ports/user-repository.port';
// ⬇️ Interface'i type-import olarak al
import type { IUserRepository } from '../../ports/user-repository.port';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../../queries/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
    constructor(
        @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    ) { }

    async execute(query: GetUsersQuery) {
        // ...
    }
}
