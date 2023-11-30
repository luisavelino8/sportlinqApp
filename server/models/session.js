import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Location from './location.js';
import User from './user.js';

const Session = sequelize.define('sessions', {
    session_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user1_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    user2_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Location, 
        key: 'location_id', 
      },
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    finished: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reviewed: {
      type: Sequelize.STRING,
      allowNull: false,
    },
});

// Definieer de relatie tussen de tabellen
Session.belongsTo(Location, { foreignKey: 'location_id', as: 'locationRelation' });
Session.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });
Session.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });
  
export default Session;