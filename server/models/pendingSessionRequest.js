import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Location from './location.js';
import User from './user.js';

const PendingSessionRequest = sequelize.define('PendingSessionRequests', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requesterUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    receiverUserId: {
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
    }
});

PendingSessionRequest.belongsTo(Location, { foreignKey: 'location_id', as: 'locationRelation' });
PendingSessionRequest.belongsTo(User, { foreignKey: 'requesterUserId', as: 'requesterUser' });
PendingSessionRequest.belongsTo(User, { foreignKey: 'receiverUserId', as: 'receiverUser' });
  
export default PendingSessionRequest;