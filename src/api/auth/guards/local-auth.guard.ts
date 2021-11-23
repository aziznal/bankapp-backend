import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Simple extension of AuthGuard used to avoid magic strings
 *
 * @export
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
