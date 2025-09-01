﻿export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}
