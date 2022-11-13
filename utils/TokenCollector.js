const Token = require('../models/Token')

const removeExpiredTokens = async () => {
    const tokens = await Token.findAll({
    })
    for (const token of tokens) {
        console.log(token.created_at)
        console.log(Date.now())
        if(token.created_at.getTime() +token.expires_in *1000 < Date.now()) {
            await Token.destroy({
                where: {
                    token: token.token
                }
            })
        }
    }
}

module.exports = {removeExpiredTokens}