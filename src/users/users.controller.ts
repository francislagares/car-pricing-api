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
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/users')
  async getUsers(@Query() filterUsersDto: GetUsersFilterDto) {
    return await this.usersService.getUsers(filterUsersDto);
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return user;
  }

  @Post('/signup')
  async createUser(@Body() authUserDto: AuthUserDto) {
    return this.authService.signup(authUserDto);
  }

  @Post('/signin')
  async signin(@Body() authUserDto: AuthUserDto) {
    return this.authService.signin(authUserDto);
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
