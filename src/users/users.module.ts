import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaService],
  controllers: [UsersController],
  providers: [UsersService, AuthService, PrismaService],
})
export class UsersModule {}
