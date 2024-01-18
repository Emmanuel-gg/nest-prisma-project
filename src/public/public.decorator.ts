import { SetMetadata } from '@nestjs/common';
import { PUBLIC_DECORATOR } from 'src/constans/decorators.constants';

export const PublicAccess = () => SetMetadata(PUBLIC_DECORATOR, true);
