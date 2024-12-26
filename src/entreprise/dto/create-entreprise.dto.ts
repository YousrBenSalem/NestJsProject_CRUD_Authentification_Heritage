/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, } from "class-validator";
import { Types } from "mongoose";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateEntrepriseDto extends CreateUserDto {
  logo: string;

  @IsString()
  @IsNotEmpty()
  readonly numero: string;

  @IsString()
  @IsNotEmpty()
  readonly siteweb: string;

  @IsString()
  @IsNotEmpty()
  readonly responsable: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly archive: string;

  readonly item: string;
  
   publication : Types.ObjectId []
   clientId : Types.ObjectId []


}
