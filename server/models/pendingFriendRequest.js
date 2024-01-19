import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';

const PendingFriendRequest = sequelize.define('PendingFriendRequests', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requesterUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    receiverUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
});
  
export default PendingFriendRequest;