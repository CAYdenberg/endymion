import errorHandler from 'errorhandler';
import express, { NextFunction, Request, Response } from 'express';
import { getReasonPhrase, getStatusCode } from 'http-status-codes';
import { startDb } from './db/index';
import { getOk, refreshCovidData, ParamsDict, View } from './views';

interface Config {
  port: number;
  nodeEnv: 'development' | 'test' | 'production';
  dbCxn: string;
}

// TODO: Request and Request body validation middleware

const useAsView =
  <ReqParams extends ParamsDict, ResParams extends ParamsDict>(
    view: View<ReqParams, ResParams>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    return view(req.body, req)
      .then((json) => {
        res.json(json);
      })
      .catch(next);
  };

export default (config: Config) => {
  startDb(config.dbCxn);

  const app = express();
  app.use(express.json());

  app.get('/', useAsView(getOk));
  app.get('/refresh-covid-data', useAsView(refreshCovidData));

  /**
   * Error Handler.
   */
  if (['development', 'test'].includes(config.nodeEnv)) {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
      // eslint-disable-next-line no-console
      console.error(err);

      const statusCode = getStatusCode(err.message);

      if (statusCode) {
        res.status(statusCode);
        res.json({
          ok: false,
          message: getReasonPhrase(err.message),
        });
      } else if (err) {
        res.status(500).send({
          ok: false,
          message: 'Internal Server Error',
        });
      } else {
        next();
      }
    });
  }

  // catch 404 (route level)
  app.use((_, res: Response) => {
    res.status(404).json({
      ok: false,
      message: 'URL route not defined',
    });
  });

  return app;
};
