import { Sequelize } from 'sequelize';

export let db: Sequelize;

export const startDb = (cxn: string | Sequelize) => {
  if (typeof cxn === 'string') {
    db = new Sequelize(cxn);
  } else {
    db = cxn;
  }
};
