import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(filterUsersDto: GetUsersFilterDto) {
    const { email } = filterUsersDto;
    return await this.prisma.users.findMany({
      where: {
        email,
      },
    });
  }

  async getUserById(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;

    const user = await this.prisma.users.create({
      data: {
        email,
        password,
      },
    });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    await this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
