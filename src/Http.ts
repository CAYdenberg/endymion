import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  public status: number;

  constructor(statusCode: StatusCodes, message?: string) {
    super(message);
    this.status = statusCode;
  }
}

export type ParamsDict = Record<string, string | number | boolean | object>;

export type View<ReqParams extends ParamsDict, ResParams extends ParamsDict> = (
  req: Request<ReqParams>
) => Promise<ResParams>;
