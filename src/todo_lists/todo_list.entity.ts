import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TodoItem } from '../todo_items/todo_item.entity';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todoList)
  todoItems: TodoItem[];
}
