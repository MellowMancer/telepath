import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RoomIdParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
