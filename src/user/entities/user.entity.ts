/* eslint-disable prettier/prettier */

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ discriminatorKey: "item" })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
  
  @Prop()
  code : string ;
  
  @Prop({default : false })
  verify : boolean ;
  	@Prop()
  refreshToken: string;
  

}
export const UserSchema = SchemaFactory.createForClass(User);
