import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import User from './user.js';

const Friend = sequelize.define('friends', {
    friend_id: {
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
});

Friend.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });
Friend.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });

export default Friend;