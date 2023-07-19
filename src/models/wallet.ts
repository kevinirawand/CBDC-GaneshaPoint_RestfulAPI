'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
   class Wallet extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models: any) {}
   }

   Wallet.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         ganesha_point: {
            type: DataTypes.FLOAT,
            defaultValue: 500.0,
         },
      },
      {
         sequelize,
         modelName: 'Wallet',
         underscored: true,
      },
   );
   return Wallet;
};
