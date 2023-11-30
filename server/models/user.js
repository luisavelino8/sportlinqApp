import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import PendingFriendRequest from './pendingFriendRequest.js';

const User = sequelize.define('users', {
   user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   userName: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   fullName: {
      type: Sequelize.STRING,
   },
   city: {
      type: Sequelize.STRING,
   },
   friends: {
      type: Sequelize.INTEGER,
   },
   reviews: {
      type: Sequelize.INTEGER,
   },
   sessions: {
      type: Sequelize.INTEGER,
   },
   aboutMe: {
      type: Sequelize.STRING,
   },
});

// Associatie voor vriendverzoeken waar de gebruiker de aanvrager is
User.hasMany(PendingFriendRequest, { as: 'Requester', foreignKey: 'requesterUserId' });

// Associatie voor vriendverzoeken waar de gebruiker de ontvanger is
User.hasMany(PendingFriendRequest, { as: 'Receiver', foreignKey: 'receiverUserId' });

export default User;