import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { UploadImageBodyDto } from './dtos/UploadImageBody.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fieldSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageBodyDto,
  ) {
    return await this.appService.uploadImages(
      file,
      JSON.parse(body.qualities),
      body.uuid,
    );
  }
}
