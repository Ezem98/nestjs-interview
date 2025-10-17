import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoItemDto {
  @ApiProperty({
    description: 'Title of the todo item',
    example: 'Apple',
    required: true,
    type: String,
    nullable: false,
  })
  title: string;
}
