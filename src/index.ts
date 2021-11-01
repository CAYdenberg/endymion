import errorHandler from 'errorhandler';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { startDb } from './db/index';
import {
  getOk,
  refreshCovidData,
  getChartData,
  getCountry,
} from './covid/views';
import { requireKey } from './middleware';
import { HttpError, View, ParamsDict } from './Http';
import multer from 'multer';
import { egChroma, parseChroma } from './seq/views';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'temp');
  },
  filename: (_, __, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, '-' + uniqueSuffix);
  },
});

const upload = multer({ storage });

interface Config {
  port: number;
  nodeEnv: 'development' | 'test' | 'production';
  dbCxn: string;
  reqPerTenMin: number;
  publicAccessKey: string;
  internalAccessKey: string;
}

const useAsView =
  <ReqParams extends ParamsDict, ResParams extends ParamsDict>(
    view: View<ReqParams, ResParams>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    return view(req as any)
      .then((json) => {
        res.json(json);
      })
      .catch(next);
  };

export default (config: Config) => {
  startDb(config.dbCxn);

  const app = express();
  app.use(express.json());

  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: config.reqPerTenMin,
    })
  );
  app.use(cors());

  app.get('/', requireKey(config.publicAccessKey), useAsView(getOk));
  app.get(
    '/chart-data',
    requireKey(config.publicAccessKey),
    useAsView(getChartData)
  );
  app.get(
    '/country/:key',
    requireKey(config.publicAccessKey),
    useAsView(getCountry)
  );

  app.get(
    '/cron/refresh-covid-data',
    requireKey(config.internalAccessKey),
    useAsView(refreshCovidData)
  );

  app.post(
    '/parse-chroma',
    requireKey(config.publicAccessKey),
    upload.single('file'),
    useAsView(parseChroma)
  );

  app.get(
    '/eg-chroma',
    requireKey(config.publicAccessKey),
    useAsView(egChroma)
  );

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

      if (err instanceof HttpError) {
        res.status(err.status);
        res.json({
          ok: false,
          message: err.message,
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
