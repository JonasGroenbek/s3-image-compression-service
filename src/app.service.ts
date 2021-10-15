import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Qualities } from './dtos/UploadImageBody.dto';
import * as sharp from 'sharp';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({ region: 'eu-central-1' });
  }
  s3: S3Client;

  qualityMappings = {
    FINE: {
      compressionQuality: 80,
      width: 1080,
      height: 1440,
    },
    DECENT: {
      compressionQuality: 70,
      width: 600,
      height: 800,
    },
    POOR: {
      compressionQuality: 75,
      width: 300,
      height: 400,
    },
  };

  async uploadImages(image: any, qualities: Qualities[], uuid: string) {
    const { buffer } = image;

    const imagePromises = qualities.map((quality) =>
      sharp(buffer)
        .resize({
          width: this.qualityMappings[quality].width,
          height: this.qualityMappings[quality].height,
          fit: 'fill',
        })
        .jpeg({
          quality: this.qualityMappings[quality].compressionQuality,
        })
        .toBuffer()
        .then((r) => ({ quality, buffer: r })),
    );

    let compressionResults;
    try {
      compressionResults = await Promise.all(imagePromises);
    } catch (e) {
      throw new Error('Could not comrpess images');
    }

    let awsResponses;
    try {
      awsResponses = await Promise.all(
        compressionResults.map((result) =>
          this.s3.send(
            new PutObjectCommand({
              Bucket: this.configService.get<string>(
                `aws.bucketName.${result.quality.toLowerCase()}`,
              ),
              Key: uuid,
              Body: result.buffer,
            }),
          ),
        ),
      );
    } catch (e) {
      throw new Error('Could not comrpess images');
    }
    console.log('awsResponses', awsResponses);
  }
}
