import axios from 'axios'

export const register = newUser => {
  return axios
    .post('users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
        return response;
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
        // console.log(response);
        if(response.data.error !== 'Invalid credentials'){
            localStorage.setItem('usertoken', response.data.access_token)
        }
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const forgotPassword = user => {
    return axios
        .post('users/forgot-password', {
        email: user.email
        })
        .then(response => {
            return response.data
        })
        .catch(err => {
        console.log(err)
        })
}

export const resetPassword = user => {
    return axios
        .post(`/users/reset-password/${user.token}`, {
        email: user.email,
        password: user.password,
        token: user.token
        })
        .then(response => {
            return response.data
        })
        .catch(err => {
        console.log(err)
        })
}

export const getProfile = token => {
    return axios
        .get('users/profile', {
        headers: { Authorization: `${token}` }
        })
        .then(response => {
        console.log(response)
        return response.data
        })
        .catch(err => {
        console.log(err)
        })
}

export const updateProfile = (token, user) => {
    return axios
        .post('users/profile/update', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        old_password: user.old_password,
        new_password: user.new_password
        }, {headers: { Authorization: `${token}` }})
        .then(response => {
        console.log(response)
        return response
        })
        .catch(err => {
        console.log(err)
        })
}

export const joinRoom = (token, id, password) => {
    return axios
        .post('rooms/join', {
        id: id,
        password: password
        }, {headers: { Authorization: `${token}` }})
        .then(response => {
        console.log(response)
        return response
        })
        .catch(err => {
        console.log(err)
        })
}

export const createRoom = (token, id, password) => {
    return axios
        .post('rooms/create', {
        id: id,
        password: password
        }, {headers: { Authorization: `${token}` }})
        .then(response => {
        console.log(response)
        return response
        })
        .catch(err => {
        console.log(err)
        })
}