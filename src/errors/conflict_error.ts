import { CONFLICT_ERROR } from './errors_status';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

export default ConflictError;
