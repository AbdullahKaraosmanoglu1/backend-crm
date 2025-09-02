import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserRepository, FindAllParams } from '../../application/ports/user-repository.port';
import { User as DomainUser } from '../../domain/entities/user.entity';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  private toDomain(r: any): DomainUser {
    return new DomainUser(
      r.id, r.email, r.passwordHash,
      r.firstName, r.lastName,
    );
  }

  async findById(id: string): Promise<DomainUser | null> {
    const r = await this.prisma.user.findUnique({ where: { id } });
    return r ? this.toDomain(r) : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const r = await this.prisma.user.findUnique({ where: { email } });
    return r ? this.toDomain(r) : null;
  }

  async create(user: DomainUser): Promise<DomainUser> {
    const r = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    return this.toDomain(r);
  }

  async findAll(params: FindAllParams): Promise<DomainUser[]> {
    const { search, skip = 0, take = 20 } = params;
    const r = await this.prisma.user.findMany({
      where: search
        ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
        : undefined,
      orderBy: { createdAt: 'desc' },
      skip, take,
    });
    return r.map(this.toDomain);
  }

  async count(params: { search?: string }): Promise<number> {
    const { search } = params;
    return this.prisma.user.count({
      where: search
        ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
        : undefined,
    });
  }
}
