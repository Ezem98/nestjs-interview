import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoItemDto } from './dtos/create-todo-item';
import { UpdateTodoItemDto } from './dtos/update-todo-item';
import { TodoItemsService } from './todo_items.service';

@ApiTags('Todo Items')
@Controller('')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  //#region Embeded Endpoints
  @Post('todolists/:todoListId/todoitems')
  @ApiOperation({
    summary: 'Create a todo item for a todo list',
    operationId: 'createTodoItemForTodoList',
  })
  @ApiResponse({ status: 201, description: 'Todo item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid todo item' })
  create(
    @Param('todoListId') todoListId: string,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ) {
    return this.todoItemsService.create(+todoListId, createTodoItemDto);
  }

  @Get('todolists/:todoListId/todoitems')
  @ApiOperation({
    summary: 'Get all todo items from a todo list',
    operationId: 'getAllTodoItemsFromTodoList',
  })
  @ApiResponse({ status: 200, description: 'Todo items found successfully' })
  findByList(@Param('todoListId') todoListId: string) {
    return this.todoItemsService.findAllFromTodoList(+todoListId);
  }

  //#endregion

  //#region Standalone Endpoints
  @Get('/todoitems')
  @ApiOperation({
    summary: 'Get all todo items',
    operationId: 'getAllTodoItems',
  })
  @ApiResponse({ status: 200, description: 'Todo items found successfully' })
  index() {
    return this.todoItemsService.all();
  }

  @Get('/todoitems/:id')
  @ApiOperation({
    summary: 'Get a todo item by ID',
    operationId: 'getTodoItem',
  })
  @ApiResponse({ status: 200, description: 'Todo item found successfully' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  show(@Param('id') id: string) {
    return this.todoItemsService.get(+id);
  }

  @Patch('/todoitems/:id/complete')
  @ApiOperation({
    summary: 'Complete a todo item by ID',
    operationId: 'completeTodoItem',
  })
  @ApiResponse({ status: 200, description: 'Todo item completed successfully' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  complete(@Param('id') id: string) {
    return this.todoItemsService.complete(+id);
  }

  @Patch('/todoitems/:id')
  @ApiOperation({
    summary: 'Update a todo item',
    operationId: 'updateTodoItem',
  })
  @ApiResponse({ status: 200, description: 'Todo item updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return this.todoItemsService.update(+id, updateTodoItemDto);
  }

  @Delete('/todoitems/:id')
  @ApiOperation({
    summary: 'Delete a todo item',
    operationId: 'deleteTodoItem',
  })
  @ApiResponse({ status: 200, description: 'Todo item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo item not found' })
  delete(@Param('id') id: string) {
    return this.todoItemsService.delete(+id);
  }

  //#endregion
}
