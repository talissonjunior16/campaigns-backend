import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupApp(app: INestApplication) {
  // Enable Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Enable CORS to allow API execution from Swagger UI
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Campanhas API')
    .setDescription(
      'Documentação da API para gerenciamento de campanhas. <br>' +
      'As campanhas podem ser associadas a categorias previamente cadastradas para garantir maior padronização e organização. <br>' +
      'Inclui funcionalidades para criação, listagem, atualização e remoção de campanhas.<br>'
    )
    .setVersion('1.0')
    .addServer('/') // Ensure correct base path for API calls
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Ensure "/" redirects to "/docs"
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req, res) => res.redirect('/docs'));
}
