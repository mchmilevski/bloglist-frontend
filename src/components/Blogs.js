import React from 'react'
import Blog from './Blog'

const Blogs = ({ blogs, setBlogs, setError, user }) => {
  return (
    <div className='blogs'>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setError={setError} user={user} />
      )}
    </div>

  )
}

export default Blogs