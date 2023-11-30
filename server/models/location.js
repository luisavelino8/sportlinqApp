import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const Location = sequelize.define('locations', {
    location_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
     },
     locationName: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     description: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     sport: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     street: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     city: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     zipcode: {
        type: Sequelize.STRING,
        allowNull: false,
     },
     image: {
      type: Sequelize.STRING,
      allowNull: false,
   },
});

export default Location;