import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglabe from './components/Togglabe'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(null)

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    const sortedByLikes = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedByLikes)
  }

  /** Get blogs */
  useEffect(() => {
    fetchBlogs()
  }, [])

  /** Get token from local storage and update user */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsUser')
  }

  return (
    <div>
      <h1>Blogs App</h1>
      {error !== null && <div className="error">{error}</div>}

      {user === null ?
        <LoginForm
          setUser={setUser}
          setError={setError}
        /> :
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div>{user.name} logged in.</div>
            <div style={{ marginLeft: '10px' }}>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          </div>

          <h2>Blogs</h2>
          <Togglabe label="New blog">
            <BlogForm
              user={user}
              setBlogs={setBlogs}
              blogs={blogs}
              setError={setError}
            />
          </Togglabe>
          <Blogs blogs={blogs} setBlogs={setBlogs} setError={setError} user={user}/>
        </React.Fragment>
      }
    </div>
  )
}

export default App