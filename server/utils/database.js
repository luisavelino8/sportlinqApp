/// CONNECTION FOR ONLINE AWS DB
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sportlinqDB', 'sportlinqroot', 'mysportlinqroot-23', {
    dialect: 'mysql',
    host: 'sportlinqdb.ccqvsjjzxi5w.eu-north-1.rds.amazonaws.com', 
});

export default sequelize;