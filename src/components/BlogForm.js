import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({
  setBlogs,
  blogs,
  setError,
  user
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogCreate = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({ title, author, url })
      setBlogs([...blogs, { ...createdBlog, user }])
      setAuthor('')
      setTitle('')
      setUrl('')
    } catch(error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  return (
    <form onSubmit={handleBlogCreate}>
      <div>
        Title: <input id='title' value={title} onChange={handleTitle} />
      </div>
      <div style={{ marginTop: '5px' }}>
        Author: <input id='author' value={author} onChange={handleAuthor} />
      </div>
      <div style={{ marginTop: '5px' }}>
        Url: <input id='url'value={url} onChange={handleUrl} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <button id='new-blog-button'type="submit">Create</button>
      </div>
    </form>
  )
}

export default BlogForm