import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './todo_item.entity';
import { TodoItemsController } from './todo_items.controller';
import { TodoItemsService } from './todo_items.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem])],
  controllers: [TodoItemsController],
  providers: [TodoItemsService],
})
export class TodoItemsModule {}
