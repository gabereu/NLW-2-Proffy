import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Select from '../../components/Select'

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import api from '../../services/api'
import useOnlyAuthenticated from '../../hooks/useOnlyAuthenticated'

export default function TeacherForm() {

  useOnlyAuthenticated();

  const history = useHistory()

  const [scheduleItems, setScheduleItems] = useState([{
    week_day: '', from: '', to: ''
  }])

  const [form, setForm] = useState({
    subject: '',
    cost: '',
  })

  const [created, setCreated] = useState(false);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target.value;
    const id = event.target.id;

    setForm(actualForm => ({
      ...actualForm,
      [id]: value,
    }))
  }

  const handleChangeScheduleItem = (field: string, key: number) => (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = event.target.value;

    setScheduleItems(actualScheduleItems => {
      const scheduleItem = actualScheduleItems[key];

      (scheduleItem as any)[field] = value

      return [...actualScheduleItems]
    })
  }

  function addScheduleItem() {
    setScheduleItems(actualScheduleItems =>
      [
        ...actualScheduleItems,
        { week_day: '', from: '', to: '' }
      ]
    )
  }
  function removeScheduleItem(index: number) {
    setScheduleItems(actualScheduleItems => {
      const newArray = [...actualScheduleItems]
      newArray.splice(index, 1)

      return [ ...newArray ]
    })
  }

  function handleCreateClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const operation = created ? api.patch : api.post

    operation('/classes', {
      ...form,
      schedule: scheduleItems,
    })
    .then(()=> {
      alert('Cadastro realizado com sucesso!')
      history.push('/give-classes')
    })
    .catch(() => {
      alert('Erro no cadastro!')
    })

  }

  useEffect(() => {
    let mounted = true;

    function convertTime(time: number) {
      return Math.floor(time / 60).toString().padStart(2, '0') + ':' + (time % 60).toString().padStart(2, '0')
    }

    api.get('/class')
    .then(response => {
      const data = response.data as Array<any>
      // console.log(data);
      if(data.length > 0 && mounted){
        const subject = data[0].subject
        const cost = String(data[0].cost)
        setForm({
          subject,
          cost
        })
        const scheduleItens = data.map(item => ({
          week_day: item.week_day,
          from: convertTime(item.from),
          to: convertTime(item.to),
        }));
        setScheduleItems(scheduleItens);
        setCreated(true)
      }

    })

    return () => {
      mounted = false;
    }
  }, [])


  return (
    <div id="page-teacher-form" className="container">
      <PageHeader
        title='Que incrível que você quer dar aulas.'
        description='O primeiro passo é preencher esse formulário'
        indicator='Minhas Aulas'
      />
      <main>
        <form onSubmit={handleCreateClass}>

          <fieldset>
            <legend>Sobre a aula</legend>
            <Select
              label='Matéria'
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
            <Input
              label='Custo da sua hora por aula'
              name='cost'
              value={form.cost}
              onChange={handleInputChange}
            />
          </fieldset>

          <fieldset>
            <legend>
              Horários disponíveis                
              <button type='button' onClick={addScheduleItem}>
                + Novo horário
              </button>
            </legend>

            {scheduleItems.map((sheduleItem, key) =>
              <div className='schedule-item-wrapper' key={Math.random() * 100}>
                <div className='schedule-item'>
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
                    value={sheduleItem.week_day}
                    onChange={handleChangeScheduleItem('week_day', key)}
                    required
                  />
                  <Input
                    label='Das'
                    name='from'
                    type='time'
                    value={sheduleItem.from}
                    onChange={handleChangeScheduleItem('from', key)}
                    required
                  />
                  <Input
                    label='Até'
                    name='to'
                    type='time'
                    value={sheduleItem.to}
                    onChange={handleChangeScheduleItem('to', key)}
                    required
                  />
                </div>
                {scheduleItems.length > 1 && 
                  <div className='schedule-item-remove'>
                      <button type='button' onClick={(e) => {removeScheduleItem(key);console.log(e.target)}}>
                        Excluir horário
                      </button>
                  </div>
                }
              </div>
            )}

          </fieldset>

          <footer>
            <p>
              <img src={warningIcon} alt="Aviso importante" />
                Importante! <br />
                Preencha todos os dados.
            </p>
            <button type='submit'>Salvar cadastro</button>
          </footer>
        </form>
      </main>
    </div>
  )
}
