import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { LoginResult } from './auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<LoginResult> {
    const OR = { OR: [{ username }, { email: username }] };
    const user = await this.usersService.findOne(
      OR as Prisma.UserWhereUniqueInput,
    );
    if (!user) {
      throw new NotFoundException();
    }

    const compare = await bcrypt.compare(pass, user.password);
    if (!compare) {
      throw new NotFoundException("Username or password doesn't match");
    }
    const payload = { sub: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
