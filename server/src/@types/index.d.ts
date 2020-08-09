import { Request } from 'express';

interface User {
    id: number;
}
  
declare module 'express' {
    export interface Request {
      user?: User; // adding our custom declaration.
    }
}