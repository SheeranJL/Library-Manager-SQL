'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a title'
        },
        notEmpty: {
          msg: 'Please enter a title'
        }
      }
    },
    author: {
       type: DataTypes.STRING,
       allowNull: false,
       validate: {
         notNull: {
           msg: 'Please enter an Author'
         },
         notEmpty: {
           msg: 'Please enter an Author'
         }
       }
     },
    genre: {
      type: DataTypes.STRING,
    },
    year: {
      type:DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
