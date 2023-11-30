import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('testloginDB', 'root', 'myroot-8', {
    dialect: 'mysql',
    host: 'localhost', 
});

export default sequelize;