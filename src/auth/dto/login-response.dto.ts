import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/base/interface/base-response';
import { LoginResult } from '../auth.interface';

export class LoginResponse extends BaseResponse {
  @ApiProperty()
  data: LoginResult;
}
