import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

const errorMappings: Record<string, { status: number; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: 'Input Data is too long' },
  P2001: { status: HttpStatus.NO_CONTENT, message: 'Record does not exist' },
  P2002: {
    status: HttpStatus.CONFLICT,
    message: 'Reference Data already exists',
  },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();

    const errorCode = exception.code;
    const errorMapping = errorMappings[errorCode];

    const description = exception.message.split('\n').pop();

    if (errorMapping) {
      const { status, message } = errorMapping;
      response.status(status).json({
        status: false,
        statusCode: status,
        message,
        description,
      });
    } else {
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      super.catch(exception, host); // Handle unknown error codes
    }
  }
}
