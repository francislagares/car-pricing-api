import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.users.findMany();
  }

  async getUserById(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
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

  async updateUser(id: string, createUserDto: CreateUserDto) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new Error('user not found!');
    }

    await this.prisma.users.update({
      where: { id: id },
      data: createUserDto,
    });

    return user;
  }
}
