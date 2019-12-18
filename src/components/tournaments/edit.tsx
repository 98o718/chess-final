import React, { useState, useEffect, useCallback } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Spinner,
  Badge,
} from 'reactstrap'
import { useRoute } from 'wouter'
import { Tournament, Organizer } from './types'
import { TOURNAMENTS_URL } from './constants'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import { OrganizerSuggestion } from '.'
import dayjs from 'dayjs'

const Edit: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament>({
    id: '',
    name: '',
    begin: new Date(),
    end: dayjs(new Date())
      .add(1, 'day')
      .toDate(),
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [, params] = useRoute('/:id/edit')

  useEffect(() => {
    fetch(`${TOURNAMENTS_URL}/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Ошибка загрузки!')
        return r.json()
      })
      .then(data => {
        setTournament(data)
        setLoading(false)
      })
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setTournament(
        Object.assign({}, tournament, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const deleteOrganizer = () => {
    setTournament(
      Object.assign({}, tournament, {
        organizer: undefined,
      })
    )
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

  useEffect(() => {
    setErrors(validate())
  }, [tournament, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setEditing(true)
      fetch(`${TOURNAMENTS_URL}/${tournament.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          ...tournament,
          name: tournament.name.trim(),
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка сохранения!')
          toast.success('Турнир изменен!')
          setEditing(false)
        })
        .catch(e => {
          toast.error(e.message)
        })
    } else {
      toast.error('Заполните все данные!')
    }
  }

  return (
    <Form
      className="d-flex flex-column align-items-center"
      style={{ minWidth: 350 }}
    >
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Название</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
          <Input
            type="text"
            name="name"
            id="name"
            invalid={errors.includes('name')}
            placeholder="Турнир Давида"
            value={tournament.name}
            onChange={handleChange}
          />
        )}
        <FormFeedback>Название не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="address">Начало</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
          <Input
            type="date"
            name="begin"
            id="begin"
            invalid={errors.includes('begin')}
            value={dayjs(tournament.begin).format('YYYY-MM-DD')}
            onChange={handleChange}
          />
          // <DatePicker
          //   type="date"
          //   name="begin"
          //   id="begin"
          //   invalid={errors.includes('begin')}
          //   value={dayjs(tournament.begin).format('YYYY-MM-DD')}
          //   onChange={changeBegin}
          // />
        )}
        <FormFeedback>
          Начало не должно быть пустым и быть позже конца
        </FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="address">Конец</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
          <Input
            type="date"
            name="end"
            id="end"
            invalid={errors.includes('end')}
            value={dayjs(tournament.end).format('YYYY-MM-DD')}
            onChange={handleChange}
          />
        )}
        <FormFeedback>
          Конец не должен быть пустым и быть раньше начала
        </FormFeedback>
      </FormGroup>
      <OrganizerSuggestion addOrganizer={addOrganizer} />
      {loading ? (
        <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
          <Skeleton height={35} />
        </FormGroup>
      ) : (
        tournament.organizer && (
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
        )
      )}
      <Button
        color="success"
        disabled={editing}
        onClick={handleSubmit}
        style={{ width: 120 }}
      >
        {editing ? (
          <Spinner color="light" style={{ width: 18, height: 18 }} />
        ) : (
          'Cохранить'
        )}
      </Button>
    </Form>
  )
}

export default Edit
