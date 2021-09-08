import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
