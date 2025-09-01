import * as bcrypt from 'bcrypt';

export class PasswordHasherService {
    private readonly rounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.rounds);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
