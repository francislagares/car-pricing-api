import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/users')
  async getUsers(@Query() filterUsersDto: GetUsersFilterDto) {
    return await this.usersService.getUsers(filterUsersDto);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/users/:id')
  async getUserById(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return user;
  }

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
