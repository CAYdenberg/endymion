// keeping this JS because ts-node doesn't like process.env

require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  dbCxn:
    process.env.DATABASE_CXN ||
    'postgres://pguser:pgpassword@localhost:5432/endymionDB',
  reqPerTenMin: process.env.REQUESTS_PER_TEN_MIN || 200,
  publicAccessKey: process.env.PUBLIC_ACCESS_KEY || '',
  internalAccessKey: process.env.INTERNAL_ACCESS_KEY || '',
};
