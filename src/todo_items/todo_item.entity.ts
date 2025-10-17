import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoList } from '../todo_lists/todo_list.entity';

@Entity()
export class TodoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  completed: boolean;

  @Column()
  todoListId: number;

  @ManyToOne(() => TodoList, (todoList) => todoList.todoItems)
  @JoinColumn({ name: 'todoListId' })
  todoList: TodoList;
}
