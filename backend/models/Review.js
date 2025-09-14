export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
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
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['serviceId']
      },
      {
        fields: ['bookingId']
      },
      {
        fields: ['customerEmail']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['isApproved']
      }
    ]
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      as: 'service'
    });
    Review.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking'
    });
  };

  return Review;
};

