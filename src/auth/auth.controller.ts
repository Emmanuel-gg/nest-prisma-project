import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { PublicAccess } from 'src/public/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponse,
  })
  @Post('login')
  @PublicAccess()
  signIn(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService
      .signIn(loginDto.username, loginDto.password)
      .then((data) => {
        return {
          status: true,
          message: 'User logged in successfully',
          data,
        };
      });
  }
}
