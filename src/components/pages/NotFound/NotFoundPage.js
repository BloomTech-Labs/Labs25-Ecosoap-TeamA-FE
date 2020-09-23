import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 Page Not Found</h1>
      <h1>
        It usually works{' '}
        <span role="img" aria-label="Crying Emoji">
          😭
        </span>{' '}
      </h1>
      <Link to="/">
        <button>Back To Home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
