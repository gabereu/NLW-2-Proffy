import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './styles.css'

import InputGroup from '../../components/GroupedInput'
import Input from '../../components/GroupedInput/Input'

import logoImg from '../../assets/images/logo.svg'
import backgroundImg from '../../assets/images/success-background.svg'
import backIcon from '../../assets/images/icons/back.svg'

import api from '../../services/api'

const ForgotPassword = () => {

  const [email, setEmail] = useState('');

  const history = useHistory();

  function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    api.post('/user/forgot_password',{email})
    .then(() => {
      alert('Foi enviado um email para o endereço informado para a redefinição de senha.')
      history.push('/')
    })
    .catch(() => {
      alert('!Ops. Email inválido')
    })
    
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
     
    setEmail(value);
  }

  return (
    <div id='forgot-pass-container'>

      <header>
          <img src={backgroundImg} className='forgot-pass-background' alt='background'/>
          <Link to='/'><img src={backIcon} className='' alt='back'/></Link>
          <div className='forgot-pass-header-content'>
            <img src={logoImg} className='logo' alt='Proffy logo' />
            <p>Sua plataforma de estudos online.</p>
          </div>
      </header>

      <div id='forgot-pass-wrapper'>

        <main>
          <form onSubmit={handleForgotPassword}>
            <h1>Eita, esqueceu a senha?</h1>

            <InputGroup>
              <Input placeholder='E-mail' id='email' value={email} onChange={handleInputChange} type='email' required/>
            </InputGroup>

            <button type='submit'>Recuperar senha</button>
          </form>
        </main>

      </div>
      
    </div>
  )
}

export default ForgotPassword;