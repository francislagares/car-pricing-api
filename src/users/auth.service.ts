import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(authUserDto: AuthUserDto) {
    // Check if email exists
    const { email } = authUserDto;
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
    authUserDto.password = hashedPassword;

    // Create new user and save it
    const user = this.usersService.createUser(authUserDto);

    // Return the user created
    return user;
  }

  async signin(authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;
    const [user] = await this.usersService.getUsers({ email });

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password !');
    }

    return user;
  }
}
