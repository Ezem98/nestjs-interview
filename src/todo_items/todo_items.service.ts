import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoItemDto } from './dtos/create-todo-item';
import { UpdateTodoItemDto } from './dtos/update-todo-item';
import { TodoItem } from './todo_item.entity';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem)
    private readonly todoItemRepository: Repository<TodoItem>,
  ) {}

  async create(todoListId: number, createTodoItemDto: CreateTodoItemDto) {
    const todoItem = this.todoItemRepository.create({
      title: createTodoItemDto.title,
      completed: false,
      todoListId,
    });
    return await this.todoItemRepository.save(todoItem);
  }

  async findAllFromTodoList(todoListId: number) {
    return await this.todoItemRepository.find({ where: { todoListId } });
  }

  async all() {
    return await this.todoItemRepository.find();
  }

  async get(id: number) {
    const todoItem = await this.todoItemRepository.findOneBy({ id });

    if (!todoItem) {
      throw new NotFoundException('Todo item not found');
    }

    return todoItem;
  }

  async update(id: number, updateTodoItemDto: UpdateTodoItemDto) {
    const todoItem = await this.todoItemRepository.findOneBy({ id });

    if (!todoItem) {
      throw new NotFoundException('Todo item not found');
    }

    return await this.todoItemRepository.save({ id, ...updateTodoItemDto });
  }

  async complete(id: number) {
    const todoItem = await this.todoItemRepository.findOneBy({ id });

    if (!todoItem) {
      throw new NotFoundException('Todo item not found');
    }

    return await this.todoItemRepository.save({
      ...todoItem,
      completed: true,
    });
  }

  async delete(id: number) {
    const todoItem = await this.todoItemRepository.findOneBy({ id });

    if (!todoItem) {
      throw new NotFoundException('Todo item not found');
    }

    return await this.todoItemRepository.delete(id);
  }
}
