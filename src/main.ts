import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  if (process.env.NODE_ENV === 'production') {
    app.setGlobalPrefix('production/image-uploader');
  } else {
    app.setGlobalPrefix('image-uploader');
  }
  const port = configService.get<number>('port');

  if (port === undefined) {
    console.error('define port');
    process.exit();
  }

  app.listen(port).then(() => {
    app.getUrl().then((url) => {
      console.log('listening on: ' + url + ' in ' + process.env.NODE_ENV);
    });
  });
}

bootstrap();
