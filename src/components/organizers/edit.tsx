import React, { useState, useEffect, useCallback } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Spinner,
  Card,
  CardBody,
  Badge,
} from 'reactstrap'
import { useRoute } from 'wouter'
import { Organizer, Tournament } from './types'
import { ORGANIZERS_URL } from './constants'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import { Suggestion } from '.'

const Edit: React.FC = () => {
  const [organizer, setOrganizer] = useState<Organizer>({
    id: '',
    name: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [, params] = useRoute('/:id/edit')

  useEffect(() => {
    fetch(`${ORGANIZERS_URL}/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Ошибка загрузки!')
        return r.json()
      })
      .then(data => {
        setOrganizer(data)
        setLoading(false)
      })
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setOrganizer(
        Object.assign({}, organizer, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const deleteTournament = (id: string) => {
    if (organizer.tournaments) {
      setOrganizer(
        Object.assign({}, organizer, {
          tournaments: organizer.tournaments.filter(
            tournament => tournament.id !== id
          ),
        })
      )
    }
  }

  const addTournament = (tournament: Tournament) => {
    let isIn = false
    if (organizer.tournaments && organizer.tournaments.length > 0) {
      isIn = organizer.tournaments.some(p => p.id === tournament.id)
    }
    if (isIn) {
      return toast.error('Турнир уже организован!')
    }
    setOrganizer(
      Object.assign({}, organizer, {
        tournaments: organizer.tournaments
          ? organizer.tournaments.concat([tournament])
          : [tournament],
      })
    )
  }

  const validate = useCallback(() => {
    let errors: string[] = []
    if (!organizer.name.trim()) {
      errors.push('name')
    }
    return errors
  }, [organizer])

  useEffect(() => {
    setErrors(validate())
  }, [organizer, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setEditing(true)
      fetch(`${ORGANIZERS_URL}/${organizer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ ...organizer, name: organizer.name.trim() }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка сохранения!')
          toast.success('Организатор изменен!')
          setEditing(false)
        })
        .catch(e => {
          toast.error(e.message)
        })
    } else {
      toast.error('Заполните данные правильно!')
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
            placeholder="Pepsi"
            value={organizer.name}
            onChange={handleChange}
          />
        )}
        <FormFeedback>Название не должно быть пустым</FormFeedback>
      </FormGroup>
      <Suggestion addTournament={addTournament} />
      {(loading ||
        (organizer.tournaments && organizer.tournaments.length > 0)) && (
        <FormGroup style={{ width: '100%' }}>
          <Label>Организуемые турниры</Label>
          <Card
            className="d-flex flex-row flex-wrap"
            style={{ width: '100%', maxWidth: 350 }}
          >
            <CardBody>
              {loading ? (
                <>
                  <span style={{ margin: '3px 5px', display: 'inline-block' }}>
                    <Skeleton height={40} width={80} />
                  </span>
                  <span style={{ margin: '3px 5px', display: 'inline-block' }}>
                    <Skeleton height={40} width={120} />
                  </span>
                  <span style={{ margin: '3px 5px', display: 'inline-block' }}>
                    <Skeleton height={40} width={70} />
                  </span>
                  <span style={{ margin: '3px 5px', display: 'inline-block' }}>
                    <Skeleton height={40} width={120} />
                  </span>
                  <span style={{ margin: '3px 5px', display: 'inline-block' }}>
                    <Skeleton height={40} width={100} />
                  </span>
                </>
              ) : (
                organizer.tournaments &&
                organizer.tournaments.length > 0 &&
                organizer.tournaments.map((tournament, ixd) => (
                  <Badge
                    className="d-inline-flex"
                    key={tournament.id}
                    style={{ margin: 5 }}
                    color="dark"
                  >
                    <h6 style={{ margin: 5 }}>
                      {tournament.name.slice(0, 15) === tournament.name
                        ? tournament.name
                        : tournament.name.slice(0, 15) + '...'}
                    </h6>
                    <Button
                      className="d-flex flex-column align-items-center"
                      close
                      style={{ color: 'white', height: '100%' }}
                      onClick={() => deleteTournament(tournament.id)}
                    />
                  </Badge>
                ))
              )}
            </CardBody>
          </Card>
        </FormGroup>
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
