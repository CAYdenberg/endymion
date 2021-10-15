import { Model, DataTypes } from 'sequelize';

interface Fields {
  key: string;
  country: string;
  data: object;
}

export class Country extends Model<Fields> {
  public key: string;
  public country: string;
  public data: object;
}

export const upsertCountryData = async (
  key: string,
  name: string,
  data: object
) => {
  const result = await Country.findAll({
    where: {
      key,
    },
  });
  if (result.length === 0) {
    await Country.create({
      key,
      country: name,
      data,
    });
  } else {
    await Country.update(
      { country: name, data },
      {
        where: {
          key,
        },
      }
    );
  }
  return true;
};

export const countryDefs = {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};
