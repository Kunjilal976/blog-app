import React, { useEffect, useContext, useState } from 'react';
import '../styles/Header.css'; 
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from "../UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/user/profile', { credentials: 'include' })
      .then(response => {
        if (response.status === 401) {
          setUserInfo(null);
        } else {
          return response.json();
        }
      })
      .then(uinfo => {
        if (uinfo) {
          setUserInfo(uinfo);
        }
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, [setUserInfo]); // Dependency array includes only setUserInfo

  function logout() {
    fetch('http://localhost:4000/user/logout', { credentials: 'include', method: 'POST' })
      .then(() => {
        setUserInfo(null);
        setRedirect(true);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
      <Navigate to="/" />;
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <header className="header">
      <Link to="/" className="logo">BlogApp</Link>
      <div className="nav">
        {userInfo ? (
          <>
            <Link to="/create" className="nav-link">Create new post</Link>
            <Link onClick={logout} className="nav-link">Logout ({userInfo.username})</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
