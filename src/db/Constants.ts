import { Model, DataTypes } from 'sequelize';

interface Fields {
  name: string;
  value: object;
}

export class Constants extends Model<Fields> {
  public name: string;
  public value: object;
}

export const createConstant = async (name: string, value: object) => {
  const result = await Constants.findAll({
    where: {
      name,
    },
  });
  if (result.length === 0) {
    await Constants.create({
      name,
      value,
    });
  } else {
    await Constants.update(
      { value },
      {
        where: {
          name,
        },
      }
    );
  }
  return true;
};

export const constantsDefs = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.JSON,
    allowNull: false,
  },
};
