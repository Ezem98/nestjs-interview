import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TodoList } from '../interfaces/todo_list.interface';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoListsService } from './todo_lists.service';

@Controller('todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all todo lists',
    operationId: 'getAllTodoLists',
  })
  @ApiResponse({ status: 200, description: 'Todo lists found successfully' })
  index(): Promise<TodoList[]> {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  @ApiOperation({
    summary: 'Get a todo list by ID',
    operationId: 'getTodoList',
  })
  @ApiResponse({ status: 200, description: 'Todo list found successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiParam({ name: 'todoListId', required: true })
  show(@Param() param: { todoListId: number }): Promise<TodoList | null> {
    return this.todoListsService.get(param.todoListId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a todo list',
    operationId: 'createTodoList',
  })
  @ApiResponse({ status: 201, description: 'Todo list created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid todo list' })
  create(@Body() dto: CreateTodoListDto): Promise<TodoList> {
    return this.todoListsService.create(dto);
  }

  @Put('/:todoListId')
  @ApiOperation({
    summary: 'Update a todo list',
    operationId: 'updateTodoList',
  })
  @ApiResponse({ status: 200, description: 'Todo list updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiParam({ name: 'todoListId', required: true })
  update(
    @Param() param: { todoListId: string },
    @Body() dto: UpdateTodoListDto,
  ): Promise<TodoList> {
    return this.todoListsService.update(Number(param.todoListId), dto);
  }

  @Delete('/:todoListId')
  @ApiOperation({
    summary: 'Delete a todo list',
    operationId: 'deleteTodoList',
  })
  @ApiResponse({ status: 200, description: 'Todo list deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo list not found' })
  @ApiParam({ name: 'todoListId', required: true })
  delete(@Param() param: { todoListId: number }): Promise<void> {
    return this.todoListsService.delete(param.todoListId);
  }
}
