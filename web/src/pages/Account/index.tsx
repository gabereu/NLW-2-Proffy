import React, { useState, useEffect } from 'react'

import './styles.css'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Textarea from '../../components/TextArea'

import warningIcon from '../../assets/images/icons/warning.svg'
import userIcon from '../../assets/images/icons/user.svg'

import useOnlyAuthenticated from '../../hooks/useOnlyAuthenticated'

import api from '../../services/api'

export interface IUser {
  name: string,
  surname: string,
  email: string,
  avatar?: string,
  whatsapp?: string,
  bio?: string,
}

export default function Profile() {

  useOnlyAuthenticated();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    avatar: '',
    whatsapp: '',
    bio: '',
  })
  // const [profile, setProfile] = useState<IUser>()

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;

    setForm(actualForm => ({
      ...actualForm,
      [id]: value,
    }))
  }

  function handleCreateClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.persist();
    
    api.patch('/user/profile', {
      ...form,
    })
    .finally(() => {
      (event.target as any).submit()
    })

  }

  useEffect(() => {
    let mounted = true

    api.get('user/profile')
    .then(response => {
      if(mounted){
        const profile = response.data;

        const serializedProfile: IUser = {
          name: profile.name,
          surname: profile.surname,
          email: profile.email,
          whatsapp: profile.whatsapp || '',
          avatar: profile.avatar || '',
          bio: profile.bio || '',
        }

        // setProfile(serializedProfile);
        setForm((serializedProfile as any));
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div id="account-page" className="container">
      <PageHeader title=''>
        <img src={form.avatar? form.avatar : userIcon} alt='avatar' />
        <span>{form.name} {form.surname}</span>
      </PageHeader>
      <main>
        <form onSubmit={handleCreateClass}>
          <fieldset>
            <legend>Seus dados</legend>
            <Input
              label='Nome'
              name='name'
              value={form.name}
              onChange={handleInputChange}
            />
            <Input
              label='Sebrenome'
              name='surname'
              value={form.surname}
              onChange={handleInputChange}
            />
            <Input
              label='Email'
              name='email'
              value={form.email}
              onChange={handleInputChange}
            />
            <Input
              label='Whatsapp'
              name='whatsapp'
              value={form.whatsapp}
              onChange={handleInputChange}
            />
            <Input
              label='Avatar'
              name='avatar'
              value={form.avatar}
              onChange={handleInputChange}
            />
            <Textarea
              label='Biografia'
              name='bio'
              value={form.bio}
              onChange={handleInputChange}
            />
          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante" />
                Importante! <br />
                Preencha todos os dados.
            </p>
            <button type='submit'>Salvar dados</button>
          </footer>
        </form>
      </main>
    </div>
  )
}
