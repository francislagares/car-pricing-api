import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    // Check if email exists
    const { email } = createUserDto;
    const users = await this.usersService.getUsers({ email });
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash user password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash salt and password together
    const hash = (await scrypt(email, salt, 32)) as Buffer;

    // Join the hashed result and salt together
    const hashedPassword = salt + '.' + hash.toString('hex');

    // Assign new hashed password to password
    createUserDto.password = hashedPassword;

    // Create new user and save it
    const user = this.usersService.createUser(createUserDto);

    // Return the user created
    return user;
  }
}
