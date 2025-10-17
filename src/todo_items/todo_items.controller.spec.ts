import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoItemDto } from './dtos/create-todo-item';
import { UpdateTodoItemDto } from './dtos/update-todo-item';
import { TodoItem } from './todo_item.entity';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';

describe('TodoItemsController', () => {
  let app: INestApplication;
  let controller: TodoItemsController;
  let todoItemRepositoryMock: jest.Mocked<Record<string, jest.Mock>>;

  beforeEach(async () => {
    todoItemRepositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemsController],
      providers: [
        TodoItemsService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: todoItemRepositoryMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<TodoItemsController>(TodoItemsController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('index', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should find all todo items', async () => {
      const mockTodoItems = [
        {
          id: 1,
          title: 'Todo Item 1',
          completed: false,
          todoListId: 1,
        },
        {
          id: 2,
          title: 'Todo Item 2',
          completed: false,
          todoListId: 1,
        },
      ];

      todoItemRepositoryMock.find.mockResolvedValue(mockTodoItems);

      const result = await controller.index();

      expect(result).toEqual(mockTodoItems);
      expect(todoItemRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findAllFromTodoList', () => {
    it('should find all todo items from a todo list', async () => {
      const mockTodoItems = [
        {
          id: 1,
          title: 'Todo Item 1',
          completed: false,
          todoListId: 1,
        },
        {
          id: 2,
          title: 'Todo Item 2',
          completed: false,
          todoListId: 1,
        },
        {
          id: 3,
          title: 'Todo Item 3',
          completed: false,
          todoListId: 2,
        },
      ];

      todoItemRepositoryMock.find.mockResolvedValue(mockTodoItems);

      const result = await controller.findByList('1');

      expect(result).toEqual(mockTodoItems);
      expect(todoItemRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should find a todo item by id', async () => {
      const mockTodoItem = {
        id: 1,
        title: 'Todo Item 1',
        completed: false,
        todoListId: 1,
      };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(mockTodoItem);

      const result = await controller.show('1');

      expect(result).toEqual(mockTodoItem);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if todo item is not found', async () => {
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      try {
        await controller.show('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(error.message).toBe('Todo item not found');
      }
    });
  });

  describe('create', () => {
    it('should create a todo item', async () => {
      const todoItem: CreateTodoItemDto = {
        title: 'Todo Item',
      };

      const todoListId = '1';

      const mockCreatedItem = {
        id: 1,
        title: 'Todo Item',
        completed: false,
        todoListId: 1,
      };

      todoItemRepositoryMock.create.mockReturnValue(mockCreatedItem);
      todoItemRepositoryMock.save.mockResolvedValue(mockCreatedItem);

      const result = await controller.create(todoListId, todoItem);

      expect(result).toEqual(mockCreatedItem);
      expect(todoItemRepositoryMock.create).toHaveBeenCalledWith({
        title: todoItem.title,
        completed: false,
        todoListId: 1,
      });
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith(mockCreatedItem);
    });
  });

  describe('update', () => {
    it('should update a todo item', async () => {
      const dto: UpdateTodoItemDto = {
        title: 'Updated Todo Item',
        completed: true,
      };

      const itemId = '1';

      const existingItem = {
        id: 1,
        title: 'Todo Item',
        completed: false,
        todoListId: 1,
      };

      const updatedItem = {
        id: 1,
        title: 'Updated Todo Item',
        completed: true,
      };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(existingItem);
      todoItemRepositoryMock.save.mockResolvedValue(updatedItem);

      const result = await controller.update(itemId, dto);

      expect(result).toEqual(updatedItem);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith({
        id: 1,
        ...dto,
      });
    });

    it('should throw an error if todo item is not found', async () => {
      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      try {
        await controller.update('1', {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(error.message).toBe('Todo item not found');
      }
    });
  });

  describe('complete', () => {
    it('should complete a todo item', async () => {
      const itemId = '1';

      const existingItem = {
        id: 1,
        title: 'Todo Item',
        completed: false,
        todoListId: 1,
      };

      const completedItem = {
        id: 1,
        title: 'Todo Item',
        completed: true,
        todoListId: 1,
      };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(existingItem);
      todoItemRepositoryMock.save.mockResolvedValue(completedItem);

      const result = await controller.complete(itemId);

      expect(result).toEqual(completedItem);
      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(todoItemRepositoryMock.save).toHaveBeenCalledWith({
        ...existingItem,
        completed: true,
      });
    });

    it('should throw a 404 error if todo item is not found', async () => {
      const itemId = '1';

      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      try {
        await controller.complete(itemId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(error.message).toBe('Todo item not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete a todo item', async () => {
      const itemId = '1';

      const existingItem = {
        id: 1,
        title: 'Todo Item',
        completed: false,
        todoListId: 1,
      };

      todoItemRepositoryMock.findOneBy.mockResolvedValue(existingItem);
      todoItemRepositoryMock.delete.mockResolvedValue(existingItem);

      await controller.delete(itemId);

      expect(todoItemRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: +itemId,
      });
      expect(todoItemRepositoryMock.delete).toHaveBeenCalledWith(+itemId);
    });

    it('should throw a 404 error if todo item is not found', async () => {
      const itemId = '1';

      todoItemRepositoryMock.findOneBy.mockResolvedValue(null);

      try {
        await controller.delete(itemId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(error.message).toBe('Todo item not found');
      }
    });
  });
});
