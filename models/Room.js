const Sequelize = require('sequelize')
const db = require('../database/db.js')
const User = require('./User')

const room = db.sequelize.define(
    'room', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING
        },
        last_activity: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        is_consistent: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        owner_id: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
            }
        }
    },
    {
        timestamps: false
    }
)
module.exports = room