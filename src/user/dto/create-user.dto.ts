/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreateUserDto {
    @ApiProperty({type:'string', description:'name'})

  @IsString()
  @IsNotEmpty()

  readonly name: string;
  @ApiProperty({type:'string', description:'username'})

  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @ApiProperty({type:'string', description:'email'})

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

     code : string ;
    verify : boolean ;

  @ApiProperty({type:'string', description:'password'})

  @IsString()
  @IsNotEmpty()
   password: string;
     refreshToken: string;

}
