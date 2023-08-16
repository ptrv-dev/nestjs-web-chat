import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/user/models/user.model';
import { Message } from 'src/message/models/message.model';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'users_chats' })
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
