import { HttpError, View } from '../Http';
import { exec } from 'child_process';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import fs from 'fs';

const PYTHON = path.join(__dirname, '../..', 'venv/bin/python3.6');
const SCRIPT = path.join(__dirname, 'seqio.py');

export const parseChroma: View<{}, {}> = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.file?.path) {
      return reject(new HttpError(StatusCodes.BAD_REQUEST));
    }

    exec(`${PYTHON} ${SCRIPT} ${req.file.path}`, (err, res) => {
      err
        ? reject(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY))
        : resolve(JSON.parse(res));

      fs.unlinkSync(path.join(__dirname, '../..', req.file!.path));
    });
  });
};
