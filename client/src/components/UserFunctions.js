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
      console.log('Registered')
    })
}

export const login = user => {
  return axios
    .post('users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
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
