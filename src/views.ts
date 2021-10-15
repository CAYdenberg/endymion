import axios from 'axios';
import { Request } from 'express';
import { processCovidData } from './processing';

import { db } from './db/index';

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

export const refreshCovidData: any = () => {
  return axios
    .get('https://covid.ourworldindata.org/data/owid-covid-data.json')
    .then((res) => {
      return processCovidData(res.data);
    });
};
