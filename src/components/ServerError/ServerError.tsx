import './ServerError.css';

const ServerError = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Oops... Something Went Wrong!</h1>
        <p>
          It seems there's a problem on our end. Please try again later, or click the button below to reload the page.
        </p>
        <button className="reload-button" onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    </div>
  );
};

export default ServerError;
