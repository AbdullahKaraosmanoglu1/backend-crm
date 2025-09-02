// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './presentation/http/auth.controller';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../../shared/security/security.module'; // ⬅️ Jwt/JwtStrategy buradan
import { SharedModule } from '../../shared/shared.module';              // ⬅️ PasswordHasherService buradan gelir

@Module({
    imports: [
        UsersModule,
        SecurityModule,  // ⬅️ JwtModule + PassportModule + JwtStrategy burada
        SharedModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
