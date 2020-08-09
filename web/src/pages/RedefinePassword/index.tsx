import React, { useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import './styles.css'

import InputGroup from '../../components/GroupedInput'
import Input from '../../components/GroupedInput/Input'

import logoImg from '../../assets/images/logo.svg'
import backgroundImg from '../../assets/images/success-background.svg'
import backIcon from '../../assets/images/icons/back.svg'

import api from '../../services/api'

const RedefinePassword = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const { token } = useParams();

  function handleRedefinePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(token){
      api.post('/user/reset_password',{
        email,
        password,
        token
      })
      .then(() => {
        alert('Senha alterada com sucesso')
        history.push('/')
      })
      .catch(() => {
        alert('!Ops. Email ou Link inválidos')
      })
    }else{
      alert('Link inválido')
    }
    
    
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;
    if(id === 'email')
      setEmail(value);
    else
      setPassword(value);
  }

  return (
    <div id='redefine-pass-container'>

      <header>
          <img src={backgroundImg} className='redefine-pass-background' alt='background'/>
          <Link to='/'><img src={backIcon} className='' alt='back'/></Link>
          <div className='redefine-pass-header-content'>
            <img src={logoImg} className='logo' alt='Proffy logo' />
            <p>Sua plataforma de estudos online.</p>
          </div>
      </header>

      <div id='redefine-pass-wrapper'>

        <main>
          <form onSubmit={handleRedefinePassword}>
            <h1>Redefinir senha</h1>

            <InputGroup>
              <Input placeholder='E-mail' id='email' value={email} onChange={handleInputChange} type='email' required/>
              <Input placeholder='Nova senha' id='password' value={password} onChange={handleInputChange} type='password' required/>
            </InputGroup>

            <button type='submit'>enviar</button>
          </form>
        </main>

      </div>
      
    </div>
  )
}

export default RedefinePassword;