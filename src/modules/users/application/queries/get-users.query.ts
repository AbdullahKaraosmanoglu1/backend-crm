export class GetUsersQuery {
    constructor(
        public readonly search?: string,
        public readonly page: number = 1,
        public readonly pageSize: number = 20,
    ) { }
}
