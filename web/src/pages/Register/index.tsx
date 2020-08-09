import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './styles.css'

import InputGroup from '../../components/GroupedInput'
import Input from '../../components/GroupedInput/Input'

import logoImg from '../../assets/images/logo.svg'
import backgroundImg from '../../assets/images/success-background.svg'
import backIcon from '../../assets/images/icons/back.svg'

import api from '../../services/api'

const Register = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    api.post('/user',{name, surname, email, password})
    .then(() => {
      alert('Cadastro concluído com sucesso')
      history.push('/')
    })
    .catch(() => {
      alert('!Ops. Email inválido')
    })
    
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;

    if(id === 'email'){
      setEmail(value);
    }else if(id === 'password'){
      setPassword(value)
    }else if(id === 'name'){
      setName(value)
    }else if(id === 'surname'){
      setSurname(value)
    }
  }

  return (
    <div id='register-container'>

      <header>
          <img src={backgroundImg} className='register-background' alt='background'/>
          <Link to='/'><img src={backIcon} className='' alt='back'/></Link>
          <div className='register-header-content'>
            <img src={logoImg} className='logo' alt='Proffy logo' />
            <p>Sua plataforma de estudos online.</p>
          </div>
      </header>

      <div id='register-wrapper'>

        <main>
          <form onSubmit={handleLogin}>
            <h1>Cadastro</h1>

            <InputGroup>
              <Input placeholder='Nome' id='name' value={name} onChange={handleInputChange} type='text' required/>
              <Input placeholder='Sobrenome' id='surname' value={surname} onChange={handleInputChange} type='text' required/>
              <Input placeholder='E-mail' id='email' value={email} onChange={handleInputChange} type='email' required/>
              <Input placeholder='Senha' id='password' value={password} onChange={handleInputChange} type='password' required/>
            </InputGroup>

            <button type='submit'>Cadastrar</button>
          </form>
        </main>

      </div>
      
    </div>
  )
}

export default Register;