import { ApiProperty, OmitType } from '@nestjs/swagger';

import { BaseResponse } from 'src/base/interface/base-response';
import { UsersDto } from './users.dto';

export class CreateUsersDto extends OmitType(UsersDto, ['id'] as const) {}

export class CreateUsersResponse extends BaseResponse {
  @ApiProperty()
  data?: UsersDto | null;
}
