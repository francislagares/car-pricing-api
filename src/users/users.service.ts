import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.users.findMany();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const user = await this.prisma.users.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }
}
