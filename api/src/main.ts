import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3003',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Work Schedule API')
    .setDescription('API para gerenciamento de agendas de trabalho')
    .setVersion('1.0')
    .addTag('Work Schedule', 'Operações relacionadas às agendas de trabalho')
    .addTag('Work Schedule Day', 'Operações relacionadas aos dias da agenda')
    .addTag('Forecast', 'Operações relacionadas às previsões mensais')
    .addTag('User', 'Operações relacionadas aos usuários')
    .addTag('Auth', 'Operações de autenticação e autorização')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('/api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

void bootstrap();