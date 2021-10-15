import { Sequelize } from 'sequelize';
import { Constants, constantsDefs } from './Constants';
import { Country, countryDefs } from './Country';

export let db: Sequelize;

export const startDb = (cxn: string | Sequelize) => {
  if (typeof cxn === 'string') {
    db = new Sequelize(cxn);
  } else {
    db = cxn;
  }

  Constants.init(constantsDefs, {
    sequelize: db,
    modelName: 'Constants',
  });

  Country.init(countryDefs, {
    sequelize: db,
    modelName: 'Countries',
  });

  return db;
};
