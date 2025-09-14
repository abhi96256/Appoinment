export default (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes',
      validate: {
        min: 15,
        max: 480 // 8 hours max
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'services',
    timestamps: true,
    indexes: [
      {
        fields: ['isActive']
      }
    ]
  });

  Service.associate = (models) => {
    Service.hasMany(models.Booking, {
      foreignKey: 'serviceId',
      as: 'bookings'
    });
  };

  return Service;
};
