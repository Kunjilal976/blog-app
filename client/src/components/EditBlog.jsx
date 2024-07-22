import React, { useEffect, useState} from 'react';
import {Navigate,useParams} from 'react-router-dom'
import '../styles/CreatePost.css'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const EditBlog = () => {

    const {id}=useParams();

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null);
    const [description,setDescription] =useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        fetch(`https://blog-app-meena.onrender.com/blog/${id}`).then((response)=>{
            response.json().then((blog)=>{
                // console.log("blog",blog);
                setTitle(blog.title)
                setSummary(blog.summary)
                setDescription(blog.description)

            })
        }
        )
    },[id]);

    async function editBlog(ev){
        ev.preventDefault();
        // Process the form data or make API calls here
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('description', description);
        // data.set('id',id);
        // console.log("sending info",title,summary,description);
        if (image!=null) {
            data.set('file', image[0]);
        }
        // console.log("data",data);
        // console.log("file",data.get(`files`), image[0]);
        ev.preventDefault();
        const response = await fetch('https://blog-app-meena.onrender.com//'+id, {
          method: 'PUT',
          body: data,
          credentials: 'include',
        });
        console.log("resp: ",response);
        if (response.ok) {
          setRedirect(true);
        }
      }

      if(redirect){
        console.log("redirecting...");
       return  <Navigate to={'/blog/'+id}/>
      }

      const handleImageChange = (e) => {
        const files = e.target.files;
        setImage(files);
      };

      const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }

    return (
        <div className="form-container">
          <h2 id="blog-heading">Edit Blog</h2>
          <form className="blog-form" onSubmit={editBlog}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
    
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary"
              required
            />
    
            <input
              type="file"
              accept="image/*"
              name='file'
              onChange={handleImageChange}
            />
    
            <ReactQuill theme="snow" modules={modules} onChange={setDescription} value={description}/>
            <button type="submit" className="submit-button">
              Update
            </button>
          </form>
        </div>
      );
}

export default EditBlog;