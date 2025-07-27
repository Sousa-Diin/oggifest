import "./loadsplash.css";

const LoginSplash = () => {
 
  return (
    <div className="body-spin">
        <div className="loading-screen">
          <div className="loading-circle"></div>
          <h2>Carregando...</h2>
        </div> 
    </div>
  );
}

export default LoginSplash;