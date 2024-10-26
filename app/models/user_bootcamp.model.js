// models/user_bootcamp.model.js

module.exports = (sequelize, DataTypes) => {
    const UserBootcamp = sequelize.define('user_bootcamp', {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        bootcamp_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bootcamps',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    return UserBootcamp;
};