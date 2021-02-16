import {User} from './user';

export class ToDo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
  user: User;
}
