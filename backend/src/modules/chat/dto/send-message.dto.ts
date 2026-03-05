import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  @MaxLength(5000, { message: 'Message must not exceed 5000 characters' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Room ID is required' })
  roomId: string;

  // Note: senderId will be extracted from JWT token, not from client input
}
