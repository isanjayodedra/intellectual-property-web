'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE tokens MODIFY COLUMN type ENUM('access', 'refresh', 'email_verification', 'password_reset', '2fa');
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE tokens MODIFY COLUMN type ENUM('access', 'refresh', 'email_verification', 'password_reset');
    `);
  }
};