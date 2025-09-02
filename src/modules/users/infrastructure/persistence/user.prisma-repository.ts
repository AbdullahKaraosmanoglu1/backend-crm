// src/modules/users/infrastructure/persistence/user.prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserRepository } from '../../application/ports/user-repository.port';
import { User as DomainUser } from '../../domain/entities/user.entity';

// Domain <-> Prisma map yardımcıları
function toDomain(prismaUser: any): DomainUser {
  return new DomainUser(
    prismaUser.id,
    prismaUser.email,
    prismaUser.firstName ?? null,
    prismaUser.lastName ?? null,
    prismaUser.passwordHash
  );
}


@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(user: DomainUser): Promise<DomainUser> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,                 // id’yi domain üretiyorsa
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
      },
    });
    return toDomain(created);
  }

  async findById(id: string): Promise<DomainUser | null> {
    const found = await this.prisma.user.findUnique({ where: { id } });
    return found ? toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const found = await this.prisma.user.findUnique({ where: { email } });
    return found ? toDomain(found) : null;
  }
}
