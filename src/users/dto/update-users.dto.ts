import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(
  OmitType(CreateUsersDto, ['password', 'createdAt', 'updatedAt', 'deletedAt']),
) {}
