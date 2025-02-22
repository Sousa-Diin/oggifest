import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import LoginSplash from './splash/LoginSplash';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({email:'augustowildes@gmail.com', pwd: 'oggifest1200' })


/*   useEffect(() => {
    // Simula o tempo de carregamento inicial antes de exibir a página de login
    const timer = setTimeout(() => setLoading(false), 3000); // 3 segundos de carregamento
    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, []); */

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(false); // Reativa o estado de carregamento ao enviar o formulário

    // Simula o carregamento e redireciona após 3 segundos
    setTimeout(() => {
      setLoading(true);
      navigate("/oggi/main/car"); // Redireciona após o tempo de carregamento
    }, 3000);
  };

  return (
    
    <section className="container-login">
     { loading ?( <div className="login-container-div">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
          <footer className='login-footer'><a>Cadastrar</a><a>esqueci minha Senha</a></footer>
        </form>
      </div>): <LoginSplash/>
      }
    </section>
  );
}

export default Login;
