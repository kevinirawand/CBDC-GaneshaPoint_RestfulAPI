'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: any) => {
   class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models: any) {
         User.hasOne(models.Wallet);
      }
   }
   User.init(
      {
         nama: DataTypes.STRING,
         no_hp: DataTypes.STRING,
         email: DataTypes.STRING,
         password: DataTypes.STRING,
         role: {
            type: DataTypes.ENUM(
               'Central_Bank',
               'Intermediaries',
               'User',
               'Merchant',
            ),
            defaultValue: 'User',
         },
      },
      {
         sequelize,
         modelName: 'User',
         underscored: true,
      },
   );
   return User;
};
