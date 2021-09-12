import { IsEmail, IsOptional } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
