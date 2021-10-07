import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { UsersService } from '../users.service';

export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { id } = request.session;

    if (id) {
      const user = await this.usersService.getUserById(id);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
