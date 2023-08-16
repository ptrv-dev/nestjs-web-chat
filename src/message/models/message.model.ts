import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from 'src/chat/models/chat.model';
import { User } from 'src/user/models/user.model';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
