import Togglabe from './Togglabe'
import blogService from '../services/blogs'

const Blog = ({ blog, setError, blogs, setBlogs, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.update({ likes: blog.likes + 1 }, blog.id)
      const updatedBlogs = blogs.map(obj => {
        if (obj.id === blog.id) {
          return { ...obj, likes: updatedBlog.likes }
        }
        return obj
      })

      setBlogs(updatedBlogs)
    } catch(error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleDelete = async () => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(obj => obj.id !== blog.id))
    } catch(error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p className='title'>{blog.title}</p>
        {user.id === blog.user.id && (
          <div style={{ paddingLeft: '10px' }}>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <Togglabe label="View">
        <p className='author'>Author: {blog.author}</p>
        <p className='url'>Url: {blog.url}</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p className='likes'>{blog.likes} likes</p>
          <div style={{ paddingLeft: '10px' }}>
            <button id="like-button" onClick={handleLike}>Like</button>
          </div>
        </div>
        <p className='user'>User: {blog.user.username}</p>
      </Togglabe>
    </div>
  )
}

export default Blog