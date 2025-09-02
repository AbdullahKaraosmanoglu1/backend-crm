// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { PasswordHasherService } from './security/password-hasher.service';

@Module({
    providers: [PasswordHasherService],
    exports: [PasswordHasherService],  // <-- Dışarı açıyoruz
})
export class SharedModule { }
