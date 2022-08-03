import { Request } from 'express';

interface SessionRequest extends Request {
  user?: {_id:string} ;
}

export default SessionRequest;
