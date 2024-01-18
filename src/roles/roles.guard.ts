import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from 'src/enums/role.enum';
import { PUBLIC_DECORATOR } from 'src/constans/decorators.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_DECORATOR,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (user.role === Role.Admin) {
      return true;
    }

    const { id } = context.switchToHttp().getRequest().params;

    if (user.sub === id) {
      return true;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
