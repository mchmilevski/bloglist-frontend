import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({
  setUser,
  setError
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onChangeUsername = (event) => {
    setUsername(event.target.value)
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogsUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
          username
        <input
          style={{ marginLeft: '10px' }}
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={onChangeUsername}
        />
      </div>
      <div>
          password
        <input
          style={{ marginLeft: '10px', marginTop: '5px' }}
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={onChangePassword}
        />
      </div>
      <button id="login-button" type="submit" style={{ marginTop: '10px' }}>login</button>
    </form>
  )
}

export default LoginForm