/* eslint-disable prettier/prettier */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe());
// Swagger configutaion
 const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('API')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
