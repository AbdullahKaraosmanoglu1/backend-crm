import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetUsersQueryDto {
    @IsOptional() @IsString()
    search?: string;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page?: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    pageSize?: number = 20;
}

export class UserResponseDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
