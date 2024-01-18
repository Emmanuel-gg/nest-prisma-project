import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...userWhereUniqueInput,
        deletedAt: null,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(data.password, +process.env.HASH_SALT);
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    const whereParam: Prisma.UserWhereInput = {
      ...where,
      deletedAt: null,
    };

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: whereParam,
      orderBy,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    if (data.password) {
      //delete data.password;
    }

    const whereParam: Prisma.UserWhereUniqueInput = {
      ...where,
      deletedAt: null,
    };

    return this.prisma.user.update({
      data,
      where: whereParam,
    });
  }

  async delete(whereParam: Prisma.UserWhereUniqueInput): Promise<User> {
    const where: Prisma.UserWhereUniqueInput = {
      ...whereParam,
      deletedAt: null,
    };

    return this.prisma.user.update({
      data: {
        deletedAt: new Date(),
      },
      where,
    });
  }
}
