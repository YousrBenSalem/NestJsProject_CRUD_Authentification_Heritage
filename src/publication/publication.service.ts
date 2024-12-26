/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreatePublicationDto } from "./dto/create-publication.dto";
//import { UpdatePublicationDto } from './dto/update-publication.dto';
import { IPublication } from "./interface/publication.interface";

import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { IEntreprise } from "src/entreprise/interface/entreprise.interface";

@Injectable()
export class PublicationService {
  constructor(
    @InjectModel("publication") private publicationModel: Model<IPublication>,
    @InjectModel ("user") private entrepriseModel : Model<IEntreprise>
  ) {}

  async createPublication(
    createPublicationDto: CreatePublicationDto,
  ): Promise<IPublication> {
    const newPublication = await new this.publicationModel(
      createPublicationDto,
    );
/*   await   this.entrepriseModel.updateOne({ _id:createPublicationDto.entreprise},{$push :{publication: newPublication._id}}) */



  const SavedPublication = await newPublication.save() as IPublication;
 const entrepriseId = await this.entrepriseModel.findById(createPublicationDto.entreprise);
 if (entrepriseId ){
    entrepriseId.publication.push(SavedPublication._id as mongoose.Types.ObjectId);
  const savedEntreprise = await entrepriseId.save();
  console.log(savedEntreprise) ;

 }else {
  console.log("Entreprise not found")
 }
      

 return SavedPublication;
  }

  async UpdatePublication(
    publicationId: string,
    updatePublicationDto: UpdatePublicationDto,
  ): Promise<IPublication> {
    const existingPublication = await this.publicationModel.findByIdAndUpdate(
      publicationId,
      updatePublicationDto,
      { new: true },
    );
    if (!existingPublication) {
      throw new NotFoundException(`Publication #${publicationId} not found`);
    }
    return existingPublication;
  }

  async getAllPublications(): Promise<IPublication[]> {
    const publicationData = await this.publicationModel.find();
    if (!publicationData || publicationData.length == 0) {
      throw new NotFoundException("Publications data not found!");
    }
    return publicationData;
  }

  async getPublication(publicationId: string): Promise<IPublication> {
    const existingPublication = await this.publicationModel
      .findById(publicationId)
      .exec();
    if (!existingPublication) {
      throw new NotFoundException(`Publication #${publicationId} not found`);
    }
    return existingPublication;
  }

 
  async deletePublication(publicationId: string): Promise<IPublication> {
    const deletedPublication =
      await this.publicationModel.findByIdAndDelete(publicationId);
    if (!deletedPublication) {
      throw new NotFoundException(`Publication #${publicationId} not found`);
    }
    //
    const entreprise = await this.entrepriseModel.findById(deletedPublication.entreprise)
    if (entreprise) {
            entreprise.publication=entreprise.publication.filter(pubId=>!pubId.equals(publicationId))

      //entreprise.publication = entreprise.publication.filter(pubId => pubId.toString() !== publicationId)
      await entreprise.save()
      console.log("update entreprise", entreprise)
      
    } else (console.log('entreprise not found'))
    return deletedPublication;
  }
}
