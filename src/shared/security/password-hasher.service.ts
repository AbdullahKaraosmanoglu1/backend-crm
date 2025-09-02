// src/modules/auth/password-hasher.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasherService {
    private readonly rounds = 10;

    hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.rounds);
    }
    compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
