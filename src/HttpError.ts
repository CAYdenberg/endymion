import { StatusCodes } from 'http-status-codes';

class HttpError extends Error {
  public status: number;

  constructor(statusCode: StatusCodes, message?: string) {
    super(message);
    this.status = statusCode;
  }
}

export default HttpError;
