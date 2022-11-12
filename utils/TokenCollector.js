const Token = require('../models/Token')

const removeExpiredTokens = async () => {
    const tokens = await Token.findAll({
    })
    for (const token of tokens) {
        console.log(token.created_at)
        console.log(Date.now().toLocaleString())
        if(token.created_at.getTime() +token.expires_in < Date.now()) {
            await Token.destroy({
                where: {
                    token: token.token
                }
            })
        }
    }
}

module.exports = {removeExpiredTokens}