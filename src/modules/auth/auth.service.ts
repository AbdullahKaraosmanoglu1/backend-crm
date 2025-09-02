// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasherService } from '../../shared/security/password-hasher.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly hasher: PasswordHasherService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await this.hasher.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        // hassas alanları UI’a döndürme (passwordHash)
        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    }

    async login(user: { id: string; email: string }) {
        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwt.sign(payload) };
    }
}
