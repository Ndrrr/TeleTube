import axios from 'axios'

export const createRoom = newRoom => {
  return axios
    .post('rooms/create', {
        id: newRoom.id,
        password: newRoom.password,
        is_consistent: newRoom.is_consistent,
        owner_id: newRoom.owner_id
    })
    .then(response => {
      return response
    })
}