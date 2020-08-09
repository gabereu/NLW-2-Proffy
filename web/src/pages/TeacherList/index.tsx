import React, { useState } from 'react'

import PageHeader from '../../components/PageHeader'
import TeacherItem from '../../components/TeacherItem'
import Input from '../../components/Input'
import Select from '../../components/Select'

import './styles.css'
import api from '../../services/api'

export default function TeacherList() {

  const [teachers, setTeachers] = useState([])

  const [form, setForm] = useState({
    subject: '',
    week_day: '',
    time: '',
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;

    setForm(actualForm => ({
      ...actualForm,
      [id]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    api.get('/classes', {
      params: form
    })
    .then((response) => {
      const classes = response.data;
      setTeachers(classes)
    })
    .catch(() => {
      alert('Erro ao procurar as aulas!')
    })

  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title='Estes são os proffys disponíveis.'>
        <form id="search-teachers" onSubmit={handleSubmit}>
          <Select
            label='Matérias'
            name='subject'
            options={[
              { value: 'Artes', label: 'Artes' },
              { value: 'Biologia', label: 'Biologia' },
              { value: 'Ciências', label: 'Ciências' },
              { value: 'Educação Física', label: 'Educação Física' },
              { value: 'Física', label: 'Física' },
              { value: 'Geografia', label: 'Geografia' },
              { value: 'História', label: 'História' },
              { value: 'Matemática', label: 'Matemática' },
              { value: 'Português', label: 'Português' },
              { value: 'Química', label: 'Química' },
            ]}
            defaultValue={undefined}
            value={form.subject}
            onChange={handleInputChange}
          />
          <Select
            label='Dia da semana'
            name='week_day'
            options={[
              { value: '0', label: 'Domingo' },
              { value: '1', label: 'Segunda-feira' },
              { value: '2', label: 'Terça-feira' },
              { value: '3', label: 'Quarta-feira' },
              { value: '4', label: 'Quinta-feira' },
              { value: '5', label: 'Sexta-feira' },
              { value: '6', label: 'Sábado' },
            ]}
            defaultValue={undefined}
            value={form.week_day}
            onChange={handleInputChange}
          />
          <Input
            label='Hora'
            name='time'
            type='time'
            value={form.time}
            onChange={handleInputChange}
          />
          <button type='submit'>
            Buscar
          </button>
        </form>
      </PageHeader>

      <main>
        {teachers.map((teacher, key) => <TeacherItem key={key} teacher={teacher} />)}
      </main>
    </div>
  )
}
