// src/modules/users/application/ports/user-repository.port.ts
import { User } from '../../domain/entities/user.entity';
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>; // ← düzelt
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
}
