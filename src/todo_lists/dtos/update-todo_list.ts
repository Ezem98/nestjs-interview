import { PartialType } from '@nestjs/swagger';
import { CreateTodoListDto } from './create-todo_list';

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {}
