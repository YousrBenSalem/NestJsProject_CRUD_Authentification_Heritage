/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";
import { User } from "src/user/entities/user.entity";
@Schema()
export class Entreprise extends User {
  @Prop()
  logo: string;

  @Prop({ required: false })
  numero: string;

  @Prop()
  siteweb: string;

  @Prop({ required: false })
  responsable: string;

  @Prop()
  description: string;

  @Prop()
  archive: string;

  item: string;

  @Prop( [{ type: mongoose.Schema.Types.ObjectId, ref: 'publication' }] )
  publication : Types.ObjectId []
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }] })
  clientId : Types.ObjectId []
}
export const EntrepriseSchema = SchemaFactory.createForClass(Entreprise);
