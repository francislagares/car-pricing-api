import { IsEmail, IsOptional } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
