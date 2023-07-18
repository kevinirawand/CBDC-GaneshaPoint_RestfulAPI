'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('Users', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
         },
         nama: {
            type: Sequelize.STRING
         },
         no_hp: {
            type: Sequelize.STRING
         },
         email: {
            type: Sequelize.STRING
         },
         password: {
            type: Sequelize.STRING
         },
         role: {
            type: Sequelize.ENUM('Central_Bank', 'Intermediaries', 'User', 'Merchant')
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
         }
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('Users');
   }
};