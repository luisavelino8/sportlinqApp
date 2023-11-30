import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
//import User from './user.js';

const PendingFriendRequest = sequelize.define('PendingFriendRequests', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requesterUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // references: {
      //   model: () => require('./user.js'),
      //   key: 'user_id',
      // },
    },
    receiverUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
});

//PendingFriendRequest.belongsTo(() => require('./user.js'), { foreignKey: 'requesterUserId', as: 'requesterUser' });
  
export default PendingFriendRequest;