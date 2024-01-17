import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  status: boolean;
}

export class BasePaginationResponse extends BaseResponse {
  @ApiProperty()
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
