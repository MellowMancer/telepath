import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Room name is required' })
  @MinLength(1, { message: 'Room name must not be empty' })
  @MaxLength(100, { message: 'Room name must not exceed 100 characters' })
  name: string;
}
