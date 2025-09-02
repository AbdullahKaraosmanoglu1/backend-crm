import { User } from '../../domain/entities/user.entity';
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
}