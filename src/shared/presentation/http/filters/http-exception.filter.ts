import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const res = exception.getResponse();

        response.status(status).json({
            statusCode: status,
            error: (res as any).error || exception.name,
            message: (res as any).message || exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}
