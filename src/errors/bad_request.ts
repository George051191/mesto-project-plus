import { BAD_REQUEST } from './errors_status';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

export default BadRequestError;
