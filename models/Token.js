const Sequelize = require('sequelize')
const db = require('../database/db.js')
const User = require('./User')

const token = db.sequelize.define(
    'token', {
        token: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        expires_in: {
            type: Sequelize.INTEGER,
            defaultValue: 1440
        },
        user_id: {
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
module.exports = token