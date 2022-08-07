import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface SessionRequest extends Request {
  user? :{
  _id: JwtPayload | string
  }
}

export default SessionRequest;
