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
import { Club, Player } from './types'
import { CLUBS_URL } from './constants'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import { Suggestion } from '.'

const Edit: React.FC = () => {
  const [club, setClub] = useState<Club>({
    id: '',
    name: '',
    address: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [, params] = useRoute('/:id/edit')

  useEffect(() => {
    fetch(`${CLUBS_URL}/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Ошибка загрузки!')
        return r.json()
      })
      .then(data => {
        setClub(data)
        setLoading(false)
      })
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setClub(
        Object.assign({}, club, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const deletePlayer = (id: string) => {
    if (club.players) {
      setClub(
        Object.assign({}, club, {
          players: club.players.filter(player => player.id !== id),
        })
      )
    }
  }

  const addPlayer = (player: Player) => {
    let isIn = false
    if (club.players && club.players.length > 0) {
      isIn = club.players.some(p => p.id === player.id)
    }
    if (isIn) {
      return toast.error('Игрок уже в клубе!')
    }
    setClub(
      Object.assign({}, club, {
        players: club.players ? club.players.concat([player]) : [player],
      })
    )
  }

  const validate = useCallback(() => {
    let errors: string[] = []
    if (!club.address) {
      errors.push('address')
    }
    if (!club.name) {
      errors.push('name')
    }
    return errors
  }, [club])

  useEffect(() => {
    setErrors(validate())
  }, [club, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setEditing(true)
      fetch(`${CLUBS_URL}/${club.id}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          ...club,
          name: club.name.trim(),
          address: club.address.trim(),
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка сохранения!')
          toast.success('Клуб изменен!')
          setEditing(false)
          // setLocation('/list/1')
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
            placeholder="Шахматная школа Давида Бдояна"
            value={club.name}
            onChange={handleChange}
          />
        )}
        <FormFeedback>Название не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="address">Адрес</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
          <Input
            type="text"
            name="address"
            id="address"
            invalid={errors.includes('address')}
            placeholder="Волкова 5/5"
            value={club.address}
            onChange={handleChange}
          />
        )}
        <FormFeedback>Адрес не должен быть пустым</FormFeedback>
      </FormGroup>
      <Suggestion addPlayer={addPlayer} />
      {(loading || (club.players && club.players.length > 0)) && (
        <FormGroup style={{ width: '100%' }}>
          <Label>Игроки</Label>
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
                club.players &&
                club.players.length > 0 &&
                club.players.map((player, isd) => (
                  <Badge
                    className="d-inline-flex"
                    key={player.id}
                    style={{ margin: 5 }}
                    color="dark"
                  >
                    <h6 style={{ margin: 5 }}>
                      {player.lastName.slice(0, 15) === player.lastName
                        ? player.lastName
                        : player.lastName.slice(0, 15) + '...'}
                    </h6>
                    <Button
                      className="d-flex flex-column align-items-center"
                      close
                      style={{ color: 'white', height: '100%' }}
                      onClick={() => deletePlayer(player.id)}
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
