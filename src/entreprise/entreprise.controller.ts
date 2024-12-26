/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Put,
  Param,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { EntrepriseService } from "./entreprise.service";
import { CreateEntrepriseDto } from "./dto/create-entreprise.dto";
import { UpdateEntrepriseDto } from "./dto/update-entreprise.dto";
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";


@ApiTags('entreprise')
@Controller("entreprise")
export class EntrepriseController {
  constructor(private readonly entrepriseService: EntrepriseService) {}

  @ApiConsumes('multipart/form-data')

@ApiBody({
  schema: {
    type:'object',
    properties: {
      name: {
        type: 'string',
          },
        
      username: {
        type: 'string',
      
      },
      email: {
        type: 'string',
      },
        password: {
        type: 'string',
      },
        item: {
        type: 'string',
        default:'entreprise'
      },
        file: {
        type: 'string',
        format:'binary'
      },
          numero: {
        type: 'string',
      },
          siteweb: {
        type: 'string',
      },
          responsable: {
        type: 'string',
      },
          description: {
        type: 'string',
      },
          archive: {
        type: 'string',
      },
  
    
      
      
    },
  },
})
  @Post()
  // add file
  @UseInterceptors(FileInterceptor("file", {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async createEntreprise(
    @Res() response,
    @Body() creatEntrepriseDto: CreateEntrepriseDto,
    @UploadedFile() file
  ) {
    try {
      creatEntrepriseDto.logo = file ? file.filename : null ;
      const newEntreprise =
        await this.entrepriseService.createEntreprise(creatEntrepriseDto);
      return response.status(HttpStatus.CREATED).json({
        message: "Entreprise has been created successfully",
        newEntreprise,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "Error: Entreprise not created!" + err,
      });
    }
  }



    @ApiConsumes('multipart/form-data')

@ApiBody({
  schema: {
    type:'object',
    properties: {
      name: {
        type: 'string',
          },
        
      username: {
        type: 'string',
      
      },
      email: {
        type: 'string',
      },
        password: {
        type: 'string',
      },
      item: {
        type: 'string',
        default:'entreprise'
      },
      file: {
        type: 'string',
        format:'binary'
      },
      numero: {
        type: 'string',
      },
      siteweb: {
        type: 'string',
      },
      responsable: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      archive: {
        type: 'string',
      },
    },
  },
})
  @Put("/:id")
    // add file
  @UseInterceptors(FileInterceptor("file", {
    storage:diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async updateClient(
    @Res() response,
    @Param("id") clientId: string,
    @Body() updateEntrepriseDto: UpdateEntrepriseDto,
    @UploadedFile() file

  ) {
    try {
      //updateEntrepriseDto.logo = file ? file.filename : null ;
      //const existingLogo=updateEntrepriseDto.logo || []
      const newLogo=file? file.filename :null
      if(!newLogo){
        updateEntrepriseDto.logo=updateEntrepriseDto.logo
      }else{
        updateEntrepriseDto.logo=newLogo
      }
      const existingEntreprise = await this.entrepriseService.UpdateEntreprise(
        clientId,
        updateEntrepriseDto,
      );
      return response.status(HttpStatus.OK).json({
        message: "Entreprise has been successfully updated",
        existingEntreprise,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get()
  async getAllEntreprises(@Res() response) {
    try {
      const entrepriseData = await this.entrepriseService.getAllEntreprises();
      return response.status(HttpStatus.OK).json({
        message: "All entreprises data found successfully",
        entrepriseData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get("/:id")
  async getAdmin(@Res() response, @Param("id") entrepriseId: string) {
    try {
      const existingEntreprise =
        await this.entrepriseService.getEntreprise(entrepriseId);
      return response.status(HttpStatus.OK).json({
        message: "Entreprise found successfully",
        existingEntreprise,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete("/:id")
  async deleteEntreprise(@Res() response, @Param("id") entrepriseId: string) {
    try {
      const deletedEntreprise =
        await this.entrepriseService.deleteEntreprise(entrepriseId);
      return response.status(HttpStatus.OK).json({
        message: "Entreprise deleted successfully",
        deletedEntreprise,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
