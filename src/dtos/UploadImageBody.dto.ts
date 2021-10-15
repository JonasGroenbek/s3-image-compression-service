import { IsArray, IsJSON, IsOptional, IsString } from 'class-validator';

export type Qualities = 'FINE' | 'DECENT' | 'POOR';

export class UploadImageBodyDto {
  @IsOptional()
  @IsJSON()
  readonly qualities?: string;

  @IsOptional()
  @IsString()
  readonly uuid?: string;
}
