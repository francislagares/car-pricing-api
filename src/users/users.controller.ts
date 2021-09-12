import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UsersService } from './users.service';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  async getUsers(@Query() filterUserDto: FilterUserDto) {
    return await this.usersService.getUsers(filterUserDto);
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.updateUser(id, createUserDto);
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
