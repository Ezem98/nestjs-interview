import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItem } from './todo_items/todo_item.entity';
import { TodoItemsModule } from './todo_items/todo_items.module';
import { TodoList } from './todo_lists/todo_list.entity';
import { TodoListsModule } from './todo_lists/todo_lists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TodoListsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [TodoList, TodoItem],
      synchronize: true,
      logging: true,
    }),
    TodoItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
