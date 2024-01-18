import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { CreateUsersDto, CreateUsersResponse } from './dto/create-users.dto';
import { UserResponse, UsersResponse } from './dto/users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { BaseResponse } from 'src/base/interface/base-response';
import { ErrorResponse } from 'src/base/interface/error-response';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { PublicAccess } from 'src/public/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const result = await this.usersService.findOne(userWhereUniqueInput);
    if (!result) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }
    return result;
  }

  @Post('')
  @ApiCreatedResponse({
    description: 'The User has been successfully created.',
    type: CreateUsersResponse,
  })
  @ApiBody({
    type: CreateUsersDto,
  })
  @ApiConflictResponse({
    description: 'User already exists.',
    type: ErrorResponse,
  })
  @PublicAccess()
  public async create(
    @Body() body: Prisma.UserCreateInput,
  ): Promise<CreateUsersResponse> {
    const user: User = await this.usersService.create(body);
    return {
      status: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get('')
  @ApiOkResponse({
    description: 'The Users has been successfully returned.',
    type: UsersResponse,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiBearerAuth()
  public async findAll() {
    const users = await this.usersService.find({});
    return {
      status: true,
      message: 'Users found successfully',
      data: users,
    };
  }

  @ApiParam({
    name: 'id',
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiOkResponse({
    description: 'The User has been successfully returned.',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get(':id')
  @ApiBearerAuth()
  public async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findOne({ id });

    if (!user) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }
    return {
      status: true,
      message: 'User found successfully',
      data: user,
    };
  }

  @ApiParam({
    name: 'id',
  })
  @Patch(':id')
  @ApiBody({
    description: 'User data to update',
    type: UpdateUsersDto,
  })
  @ApiOkResponse({
    description: 'The User has been successfully updated.',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: Prisma.UserUpdateInput,
  ) {
    const result = await this.usersService.update({
      where: { id },
      data: body,
    });

    if (!result) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }

    return {
      status: true,
      message: 'User updated successfully',
      data: result,
    };
  }

  @ApiParam({
    name: 'id',
  })
  @Delete(':id')
  @ApiOkResponse({
    description: 'The User has been successfully deleted.',
    type: BaseResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBearerAuth()
  @Roles(Role.Admin)
  public async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.usersService.delete({ id });

    if (!result) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }

    return {
      status: true,
      message: 'User deleted successfully',
      data: result,
    };
  }
}
