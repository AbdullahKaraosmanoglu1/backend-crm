import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHasherService {
    private readonly rounds = 10;
    hash(p: string) { return bcrypt.hash(p, this.rounds); }
    compare(p: string, h: string) { return bcrypt.compare(p, h); }
}