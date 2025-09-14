'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('services', [
      {
        name: 'Haircut',
        duration: 30,
        price: 25.00,
        description: 'Professional haircut and styling',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hair Color',
        duration: 120,
        price: 80.00,
        description: 'Full hair coloring service',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manicure',
        duration: 45,
        price: 35.00,
        description: 'Complete nail care and polish',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Facial Treatment',
        duration: 60,
        price: 65.00,
        description: 'Deep cleansing facial treatment',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Massage Therapy',
        duration: 90,
        price: 100.00,
        description: 'Relaxing full-body massage',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('services', null, {});
  }
};
