import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../../queries/get-users.query';
import { USER_REPOSITORY } from '../../ports/user-repository.port';
import type { IUserRepository } from '../../ports/user-repository.port';

type SafeUser = Omit<
    Awaited<ReturnType<IUserRepository['findAll']>>[number],
    'passwordHash'
>;

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
    private readonly log = new Logger(GetUsersHandler.name);

    constructor(@Inject(USER_REPOSITORY) private readonly users: IUserRepository) { }

    async execute(query: GetUsersQuery): Promise<{
        items: SafeUser[];
        total: number;
        skip: number;
        take: number;
    }> {
        const { search, skip = 0, take = 20 } = query;

        this.log.log(`RUN search=${search} skip=${skip} take=${take}`);

        const [items, total] = await Promise.all([
            this.users.findAll({ search, skip, take }),
            this.users.count({ search }),
        ]);

        const safeItems = items.map(({ passwordHash, ...rest }) => rest as SafeUser);
        return { items: safeItems, total, skip, take };
    }
}
