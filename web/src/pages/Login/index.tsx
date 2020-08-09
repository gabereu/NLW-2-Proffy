import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './styles.css'

import InputGroup from '../../components/GroupedInput'
import Input from '../../components/GroupedInput/Input'
import CheckBox from '../../components/CheckBox'

import logoImg from '../../assets/images/logo.svg'
import backgroundImg from '../../assets/images/success-background.svg'

import api from '../../services/api'

import { authContext } from '../../contexts/authContext'

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setSigned } = useContext(authContext);

  const history = useHistory();

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    api.post('/user/auth',{email, password})
    .then(() => {
      setSigned(true);
      history.push('/inicio')
    })
    .catch(() => {
      alert('!Ops. Email e/ou senha inválidos')
    })
    
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;

    if(id === 'email'){
      setEmail(value);
    }else if(id === 'password'){
      setPassword(value)
    }
  }

  useEffect(() => {
    let mounted = true

    api.get('/user/isAuthenticated')
    .then(()=>{
      if(mounted){
        setSigned(true);
        history.push('/inicio');
      }
    })
    .catch(()=>{
      // setSigned(false);
    })

    return () => {
      mounted = false
    }
  // eslint-disable-next-line
  }, [])

  return (
    <div id='login-container'>

      <header>
          <img src={backgroundImg} className='login-background' alt='background'/>
          <img src={logoImg} className='logo' alt='Proffy logo' />
          <p>Sua plataforma de estudos online.</p>
      </header>

      <div id='login-wrapper'>

        <main>
          <form onSubmit={handleLogin}>
            <h1>Fazer Login</h1>

            <InputGroup>
              <Input placeholder='E-mail' id='email' value={email} onChange={handleInputChange} type='email'/>
              <Input placeholder='Senha' id='password' value={password} onChange={handleInputChange} type='password'/>
            </InputGroup>

            <div className="login-options">
              <CheckBox label='lembrar-me' />
              <Link to='/esqueciminhasenha'>Esqueci minha senha</Link>
            </div>

            <button type='submit'>Entrar</button>
          </form>
        </main>

        <footer>
          <span>Não tem conta?<br/><Link to='/cadastro'>Cadastre-se</Link></span>
          <span className="its-free">É de graça <span>&#10084;</span></span>
        </footer>

      </div>
      
    </div>
  )
}

export default Login;