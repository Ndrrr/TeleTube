const Room = require('../models/Room')

async function destroyRoom(room_id) {
    const room = await Room.findOne({
        where: {
            id: room_id
        }
    })
    if (room) {
        await Room.destroy({
            where: {
                id: room_id
            }
        })
    } else {
        return false;
    }
    return true;
}

module.exports = {destroyRoom}