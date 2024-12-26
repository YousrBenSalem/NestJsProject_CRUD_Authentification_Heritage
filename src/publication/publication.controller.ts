/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { PublicationService } from "./publication.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";

//import { UpdatePublicationDto } from './dto/update-publication.dto';
@ApiTags('publication')
@Controller("publication")
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}
@ApiConsumes('multipart/form-data')

@ApiBody({
  schema: {
    type:'object',
    properties: {
      titre: {
        type: 'string',
    
        maxLength: 30,
      },
      description: {
        type: 'string',
      
        maxLength: 100,
      },
      date: {
        type: 'string',
      },
      files: {
        type: 'array',
        items: { type: 'string',        format:'binary'
 },
    
      },
      prix: {
        type: 'number',
      
      },
      promotion: {
        type: 'number',
        
      },
      entreprise: {
        type: 'string',
    
      },
    },
  },
})

  @Post()

    // add file
  @UseInterceptors(FilesInterceptor("files",10, {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))

  async createPublication(
    @Res() response,
    @Body() createPublicationDto: CreatePublicationDto,
    @UploadedFiles() files

  ) {
    try {
      createPublicationDto.image =  files ? files.map(file => file.filename) : [];
      const newPublication =
        await this.publicationService.createPublication(createPublicationDto);
      return response.status(HttpStatus.CREATED).json({
        message: "Publication has been created successfully",
        newPublication,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "Error: Publication not created!" + err,
      });
    }
  }
  @ApiConsumes('multipart/form-data')

  @ApiBody({
  schema: {
    type:'object',
    properties: {
      titre: {
        type: 'string',
    
        maxLength: 30,
      },
      description: {
        type: 'string',
      
        maxLength: 100,
      },
      date: {
        type: 'string',
      },
      files: {
        type: 'array',
        items: { type: 'string',        format:'binary'
 },
    
      },
      prix: {
        type: 'number',
      
      },
      promotion: {
        type: 'number',
        
      },
      entreprise: {
        type: 'string',
    
      },
    },
  },
})
  @Put("/:id")
      // add file
  @UseInterceptors(FilesInterceptor("files",10, {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async updatePublication(
    @Res() response,
    @Param("id") publicationId: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
        @UploadedFiles() files

  ) {
    try {
      //updatePublicationDto.image =  files ? files.map(file => file.filename) : [];
      const existingImages = updatePublicationDto.image || [];
      const newImages = files ? files.map(file => file.filename) : [];
      updatePublicationDto.image = [...existingImages, ...newImages];
      const existingPublication =
        await this.publicationService.UpdatePublication(
          publicationId,
          updatePublicationDto,
        );
      return response.status(HttpStatus.OK).json({
        message: "Publication has been successfully updated",
        existingPublication,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get()
  async getPublications(@Res() response) {
    try {
      const publicationData =
        await this.publicationService.getAllPublications();
      return response.status(HttpStatus.OK).json({
        message: "All publications data found successfully",
        publicationData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST
      ).json({
        message: "Error fetching publications data"+err,
      });
    }
  }
  @Get("/:id")
  async getPublication(@Res() response, @Param("id") publicationId: string) {
    try {
      const existingPublication =
        await this.publicationService.getPublication(publicationId);
      return response.status(HttpStatus.OK).json({
        message: "Publication found successfully",
        existingPublication,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Delete("/:id")
  async deletePublication(@Res() response, @Param("id") publicationId: string) {
    try {
      const deletedPublication =
        await this.publicationService.deletePublication(publicationId);
      return response.status(HttpStatus.OK).json({
        message: "Publication deleted successfully",
        deletedPublication,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);


    }
  }
}
