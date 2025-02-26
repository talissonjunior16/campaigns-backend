import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.listen(process.env.PORT || 3000);

  console.log(`🚀 Application running at: ${await app.getUrl()}`);
  console.log(`📄 Swagger Docs available at: ${await app.getUrl()}/docs`);
}

bootstrap();
