import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTodoItemDto } from './create-todo-item';

export class UpdateTodoItemDto extends PartialType(CreateTodoItemDto) {
  @ApiProperty({
    description: 'Status of the todo item',
    example: true,
    required: false,
    type: Boolean,
    default: false,
    nullable: false,
  })
  completed?: boolean;
}
