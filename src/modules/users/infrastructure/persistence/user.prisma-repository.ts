import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserPrismaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    return new User(
      created.id,
      created.email,
      created.passwordHash,
      created.firstName ?? '',
      created.lastName ?? '',
    );
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.prisma.user.findUnique({ where: { id } });
    return found
      ? new User(
          found.id,
          found.email,
          found.passwordHash,
          found.firstName ?? '',
          found.lastName ?? '',
        )
      : null;
  }
}
