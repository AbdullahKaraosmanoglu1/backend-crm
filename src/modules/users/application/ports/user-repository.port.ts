import { User } from '../../domain/entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface FindAllParams {
    search?: string;
    skip?: number;
    take?: number;
}

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    findAll(params: FindAllParams): Promise<User[]>;
    count(params: { search?: string }): Promise<number>;
}
