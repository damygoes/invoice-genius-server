import { Request } from 'express';
import { UserDTO } from './User';

export interface CustomRequest extends Request {
  user?: UserDTO;
}
