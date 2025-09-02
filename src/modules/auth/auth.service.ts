// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasherService } from '../../shared/security/password-hasher.service';
import * as crypto from 'node:crypto';

function isSha256Hex(s: string): boolean {
    return /^[a-f0-9]{64}$/i.test(s);
}
function sha256Hex(s: string): string {
    return crypto.createHash('sha256').update(s).digest('hex');
}

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

        // 1) bcrypt ile dene
        let ok = false;
        if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2y$')) {
            ok = await this.hasher.compare(password, user.passwordHash);
        } else if (isSha256Hex(user.passwordHash)) {
            // 2) Eski SHA-256 ile dene
            ok = sha256Hex(password) === user.passwordHash;
            // Eşleşirse anında bcrypt’e yükselt
            if (ok) {
                const newHash = await this.hasher.hash(password);
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { passwordHash: newHash },
                });
            }
        }

        if (!ok) throw new UnauthorizedException('Invalid credentials');
        return user; // hassas alanları (passwordHash vb.) DTO/serializer’da gizleyin
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
