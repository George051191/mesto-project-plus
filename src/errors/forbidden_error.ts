import { FORBIDDEN_ERROR } from './errors_status';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
