import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base-response';

export class ErrorResponse extends BaseResponse {
  @ApiProperty()
  description: string;
}
