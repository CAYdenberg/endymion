import { Request } from 'express';

import { db } from './db';

export type ParamsDict = Record<string, string | number | boolean>;

export type View<ReqParams extends ParamsDict, ResParams extends ParamsDict> = (
  body: ReqParams,
  req?: Request
) => Promise<ResParams>;

export const getOk: View<ParamsDict, { ok: boolean }> = () => {
  return db
    .authenticate({
      logging: false,
    })
    .then(() => {
      return { ok: true };
    });
};
