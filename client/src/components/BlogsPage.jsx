import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/blog/getBlogs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(posts => {
        console.log("Posts: ", posts);
        setPosts(posts);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
      });
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => (
          <BlogCard key={post._id} {...post} />
        ))
      ) : (
        <p>No blog posts available.</p>
      )}
    </div>
  );
};

export default BlogsPage;
