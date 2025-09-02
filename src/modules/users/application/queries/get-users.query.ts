// src/modules/users/application/queries/get-users.query.ts
export class GetUsersQuery {
    constructor(
        public readonly search?: string,  // string | undefined
        public readonly skip: number = 0,
        public readonly take: number = 20,
    ) { }
}
