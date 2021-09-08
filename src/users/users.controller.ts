import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
