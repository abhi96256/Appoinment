export default (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 20]
      }
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
      defaultValue: 'confirmed'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    confirmationCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        fields: ['bookingDate', 'startTime']
      },
      {
        fields: ['customerEmail']
      },
      {
        fields: ['confirmationCode']
      },
      {
        fields: ['status']
      }
    ]
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      as: 'service'
    });
  };

  return Booking;
};
