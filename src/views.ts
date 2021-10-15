import axios from 'axios';
import { Request } from 'express';
import { processCovidData } from './processing';

import { db } from './db/index';
import { Constants, createConstant } from './db/Constants';
import { StatusCodes } from 'http-status-codes';
import { Country, upsertCountryData } from './db/Country';
import HttpError from './HttpError';

export type ParamsDict = Record<string, string | number | boolean | object>;

export type View<ReqParams extends ParamsDict, ResParams extends ParamsDict> = (
  req: Request<ReqParams>
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

export const refreshCovidData: any = async () => {
  const res = await axios.get(
    'https://covid.ourworldindata.org/data/owid-covid-data.json'
  );

  const processed = processCovidData(res.data);

  await createConstant('TIMELINE_LABELS', processed.timelineLabels);
  await createConstant('COUNTRY_NAMES', processed.countryNames);

  await Promise.all(
    processed.countryData.map((country) =>
      upsertCountryData(country.key, country.country, country)
    )
  );

  return processed;
};

export const getChartData: View<{}, {}> = async () => {
  try {
    const labels = await Constants.findOne({
      where: { name: 'TIMELINE_LABELS' },
    });
    const countryNames = await Constants.findOne({
      where: { name: 'COUNTRY_NAMES' },
    });

    if (!labels || !countryNames) {
      throw new HttpError(StatusCodes.NOT_IMPLEMENTED);
    }

    return {
      timelineLabels: labels.value,
      countryNames: countryNames.value,
    };
  } catch (e) {
    throw new HttpError(StatusCodes.BAD_REQUEST);
  }
};

export const getCountry: View<{ key: string }, {}> = async (req) => {
  if (!req.params.key) {
    throw new HttpError(StatusCodes.BAD_REQUEST);
  }

  const result = await Country.findOne({
    where: { key: req.params.key },
  });

  if (!result) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  return result.data;
};
