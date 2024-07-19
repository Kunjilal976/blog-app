import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../styles/CreatePost.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    console.log("Title:", title);
    console.log("Summary:", summary);
    console.log("Image:", image);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("description", description);
    if (image != null) data.set("files", image[0]);
    // console.log("file",data.get(`files`), image[0]);
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/blog/create", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    console.log("resp: ", response);
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImage(files);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="form-container">
      <h2 id="blog-heading">Create Blog</h2>
      <form className="blog-form" onSubmit={createNewPost}>
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
          onChange={handleImageChange}
          required
        />

        <ReactQuill theme="snow" modules={modules} onChange={setDescription} />
        <button type="submit" className="submit-button">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
