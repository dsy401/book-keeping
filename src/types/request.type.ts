import { Request as ExpressRequest } from 'express';
import { User } from '../module/domain/user/user';

export type JwtRequest = ExpressRequest & {
  user: User;
};
