// src/modules/shared/security/security.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                secret: cfg.get<string>('JWT_SECRET', ''), // fallback vermemek daha güvenli
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class SecurityModule { }
