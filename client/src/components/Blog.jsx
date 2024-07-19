import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import '../styles/Blog.css';
import { UserContext } from '../UserContext';
import { format } from 'date-fns';

const Blog = () => {
    const { id } = useParams();
    const [blogInfo, setBlogInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/blog/${id}`)
            .then(response => response.json())
            .then(blog => setBlogInfo(blog))
            .catch(error => console.error('Error fetching blog info:', error));
    }, [id]);

    async function deleteBlog() {
        const response = await fetch(`http://localhost:4000/blog/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        } else {
            const msg = await response.json();
            console.log('Msg received:', msg);
        }
    }

    if (redirect) return <Navigate to="/" />;
    if (!blogInfo) return <div>Loading...</div>;
    if (!userInfo) return <div>Loading user info...</div>;

    // Fix the image URL here
    const imagePath = blogInfo.cover.startsWith('uploads/') 
        ? `http://localhost:4000/${blogInfo.cover}`
        : `http://localhost:4000/uploads/${blogInfo.cover}`;

    const newLocal = (
        <div className='buttons'>
            <div className='editBlog'>
                <Link className="edit-btn" to={`/edit/${blogInfo._id}`}>
                    <p>Edit Blog</p>
                </Link>
            </div>
            <div className='deleteBlog'>
                <Link className="delete-btn" onClick={deleteBlog}>
                    <p>Delete Blog</p>
                </Link>
            </div>
        </div>
    );

    return (
        <div>
            <div className="blogTitle">{blogInfo.title}</div>
            <div className='blogDate'>{format(new Date(blogInfo.createdAt), 'dd-MM-yyyy, hh:mm a')}</div>
            <div className='blogAuthor'>~{blogInfo.author.username}</div>
            {userInfo.id === blogInfo.author._id && newLocal}
            <img src={imagePath} alt='Blog' />
            <div className='blogDescription' dangerouslySetInnerHTML={{ __html: blogInfo.description }} />
        </div>
    );
};

export default Blog;
