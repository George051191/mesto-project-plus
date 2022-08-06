import { NOT_FOUND } from './errors_status';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

export default NotFoundError;
