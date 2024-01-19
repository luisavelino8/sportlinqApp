import { Sequelize } from 'sequelize';
import sequelize from '../utils/database.js';
import Location from './location.js';
import User from './user.js';
import Session from './session.js';

const Review = sequelize.define('reviews', {
    review_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Session, 
          key: 'session_id', 
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
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    reviewText: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
});

Review.belongsTo(Location, { foreignKey: 'location_id', as: 'locationReview' });
Review.belongsTo(Session, { foreignKey: 'session_id', as: 'sessionReview' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'userReview' });
  
export default Review;