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
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { users } from '.prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whomami')
  @UseGuards(AuthGuard)
  WhoAmI(@CurrentUser() user: users) {
    return user;
  }

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
  async createUser(@Body() authUserDto: AuthUserDto, @Session() session: any) {
    const user = await this.authService.signup(authUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signin(@Body() authUserDto: AuthUserDto, @Session() session: any) {
    const user = await this.authService.signin(authUserDto);
    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  async SignOut(@Session() session: any) {
    return (session.userId = null);
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
