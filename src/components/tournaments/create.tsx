import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  FormFeedback,
  Badge,
} from 'reactstrap'
import { Tournament, Organizer } from './types'
import { TOURNAMENTS_URL } from './constants'
import { useLocation } from 'wouter'
import { toast } from 'react-toastify'
import { OrganizerSuggestion } from '.'
import dayjs from 'dayjs'

const Create: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>({
    id: '',
    name: '',
    begin: new Date(),
    end: dayjs(new Date())
      .add(1, 'day')
      .toDate(),
  })
  const [creating, setCreating] = useState(false)
  const [, setLocation] = useLocation()
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setTournament(
        Object.assign({}, tournament, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const validate = useCallback(() => {
    console.log(dayjs(tournament.end).diff(dayjs(tournament.begin), 'day'))

    let errors: string[] = []
    if (!tournament.name.trim()) {
      errors.push('name')
    }
    if (
      !tournament.begin ||
      dayjs(tournament.end).diff(dayjs(tournament.begin), 'day') < 0
    ) {
      errors.push('begin')
    }
    if (
      !tournament.end ||
      dayjs(tournament.end).diff(dayjs(tournament.begin), 'day') < 0
    ) {
      errors.push('end')
    }
    if (!tournament.organizer) {
      errors.push('organizer')
    }
    return errors
  }, [tournament])

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setErrors(validate())
    console.log(tournament)
  }, [tournament, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setCreating(true)
      fetch(TOURNAMENTS_URL, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          name: tournament.name.trim(),
          begin: tournament.begin,
          end: tournament.end,
          organizer: tournament.organizer,
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка создания!')
          toast.success('Турнир создан!')
          setLocation('/list/1')
        })
        .catch(e => {
          toast.error(e.message)
        })
    } else {
      toast.error('Заполните все данные!')
    }
  }

  const addOrganizer = (organizer: Organizer) => {
    setTournament(
      Object.assign({}, tournament, {
        organizer: {
          id: organizer.id,
          name: organizer.name,
        },
      })
    )
  }

  const deleteOrganizer = () => {
    setTournament(
      Object.assign({}, tournament, {
        organizer: undefined,
      })
    )
  }

  return (
    <Form
      className="d-flex flex-column align-items-center"
      style={{ minWidth: 350 }}
    >
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Название</Label>
        <Input
          type="text"
          name="name"
          id="name"
          spellCheck={false}
          invalid={errors.includes('name')}
          placeholder="BDOYANment"
          value={tournament.name}
          onChange={handleChange}
          onKeyDown={e => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        />
        <FormFeedback>Название не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Начало</Label>
        <Input
          type="date"
          name="begin"
          id="begin"
          spellCheck={false}
          invalid={errors.includes('begin')}
          // placeholder="Давид"
          value={dayjs(tournament.begin).format('YYYY-MM-DD')}
          onChange={handleChange}
        />
        <FormFeedback>
          Начало не должно быть пустым и быть позже конца
        </FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Конец</Label>
        <Input
          type="date"
          name="end"
          id="end"
          spellCheck={false}
          invalid={errors.includes('end')}
          // placeholder="Волкова 5/5"
          value={dayjs(tournament.end).format('YYYY-MM-DD')}
          onChange={handleChange}
        />
        <FormFeedback>
          Конец не должен быть пустым и быть раньше начала
        </FormFeedback>
      </FormGroup>
      <OrganizerSuggestion addOrganizer={addOrganizer} />
      {tournament.organizer && (
        <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
          <Badge
            className="d-inline-flex justify-content-between"
            style={{ width: '100%' }}
            color="dark"
          >
            <h6 style={{ margin: 5 }}>
              {tournament.organizer.name.slice(0, 37) ===
              tournament.organizer.name
                ? tournament.organizer.name
                : tournament.organizer.name.slice(0, 37) + '...'}
            </h6>
            <Button
              className="d-flex flex-column align-items-center"
              close
              style={{ color: 'white', height: '100%' }}
              onClick={() => deleteOrganizer()}
            />
          </Badge>
        </FormGroup>
      )}

      <Button
        color="success"
        disabled={creating}
        onClick={handleSubmit}
        style={{ width: 100 }}
      >
        {creating ? (
          <Spinner color="light" style={{ width: 18, height: 18 }} />
        ) : (
          'Создать'
        )}
      </Button>
    </Form>
  )
}

export default Create
