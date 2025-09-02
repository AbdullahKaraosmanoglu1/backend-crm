// src/modules/users/domain/entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string | null,   // ← düzelt
    public readonly lastName: string | null,    // ← düzelt
  ) { }
}
