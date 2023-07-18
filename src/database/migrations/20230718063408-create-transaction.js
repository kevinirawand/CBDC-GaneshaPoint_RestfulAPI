'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wallet_sender: {
        type: Sequelize.STRING
      },
      wallet_receiver: {
        type: Sequelize.STRING
      },
      phone_number_receiver: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.ENUM('success', 'fail')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};