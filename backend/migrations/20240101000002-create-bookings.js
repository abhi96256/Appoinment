'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      customerName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      customerEmail: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      customerPhone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      bookingDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('confirmed', 'cancelled', 'completed'),
        defaultValue: 'confirmed'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      confirmationCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
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

    await queryInterface.addIndex('bookings', ['bookingDate', 'startTime']);
    await queryInterface.addIndex('bookings', ['customerEmail']);
    await queryInterface.addIndex('bookings', ['confirmationCode']);
    await queryInterface.addIndex('bookings', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};
