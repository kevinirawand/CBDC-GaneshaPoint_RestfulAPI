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
         // define association here
      }
   }
   User.init(
      {
         nama: DataTypes.STRING,
         no_hp: DataTypes.STRING,
         email: DataTypes.STRING,
         ganesha_point: {
            type: DataTypes.FLOAT,
            defaultValue: 500.0,
         },
         password: DataTypes.STRING,
         role: DataTypes.ENUM(
            'Central_Bank',
            'Intermediaries',
            'User',
            'Merchant',
         ),
      },
      {
         sequelize,
         modelName: 'User',
         underscored: true,
      },
   );
   return User;
};
