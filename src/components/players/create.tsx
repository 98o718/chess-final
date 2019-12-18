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
import { Player, Club } from './types'
import { PLAYERS_URL } from './constants'
import { useLocation } from 'wouter'
import { toast } from 'react-toastify'
import { ClubSuggestion } from '.'
import InputMask from 'react-input-mask'

const Create: React.FC = () => {
  const [player, setPlayer] = useState<Player>({
    id: '',
    firstName: '',
    lastName: '',
    address: '',
    tel: '',
    email: '',
    rank: '',
  })
  const [creating, setCreating] = useState(false)
  const [, setLocation] = useLocation()
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setPlayer(
        Object.assign({}, player, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const validate = useCallback(() => {
    let errors: string[] = []
    if (!player.firstName.trim()) {
      errors.push('firstName')
    }
    if (!player.lastName.trim()) {
      errors.push('lastName')
    }
    if (!player.address.trim()) {
      errors.push('address')
    }
    if (!player.tel.trim()) {
      errors.push('tel')
    }
    if (
      !player.email.trim() ||
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(player.email.trim())
    ) {
      errors.push('email')
    }
    if (!player.rank.trim()) {
      errors.push('rank')
    }
    return errors
  }, [player])

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setErrors(validate())
    console.log(player)
  }, [player, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setCreating(true)
      fetch(PLAYERS_URL, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          firstName: player.firstName.trim(),
          lastName: player.lastName.trim(),
          address: player.address.trim(),
          tel: player.tel.trim(),
          email: player.email.trim(),
          rank: player.rank.trim(),
          club: player.club,
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка создания!')
          toast.success('Игрок создан!')
          setLocation('/list/1')
        })
        .catch(e => {
          toast.error(e.message)
        })
    } else {
      toast.error('Заполните данные правильно!')
    }
  }

  const addClub = (club: Club) => {
    setPlayer(
      Object.assign({}, player, {
        club: {
          id: club.id,
          name: club.name,
        },
      })
    )
    console.log(player)
  }

  const deleteClub = () => {
    setPlayer(
      Object.assign({}, player, {
        club: undefined,
      })
    )
  }

  return (
    <Form
      className="d-flex flex-column align-items-center"
      style={{ minWidth: 350 }}
    >
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Фамилия</Label>
        <Input
          type="text"
          name="lastName"
          id="lastName"
          spellCheck={false}
          invalid={errors.includes('lastName')}
          placeholder="Бдоян"
          value={player.lastName}
          onChange={handleChange}
        />
        <FormFeedback>Фамилия не должна быть пустой</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Имя</Label>
        <Input
          type="text"
          name="firstName"
          id="firstName"
          spellCheck={false}
          invalid={errors.includes('firstName')}
          placeholder="Давид"
          value={player.firstName}
          onChange={handleChange}
        />
        <FormFeedback>Имя не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Адрес</Label>
        <Input
          type="text"
          name="address"
          id="address"
          spellCheck={false}
          invalid={errors.includes('address')}
          placeholder="Волкова 5/5"
          value={player.address}
          onChange={handleChange}
        />
        <FormFeedback>Адрес не должен быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Телефон</Label>
        <Input
          type="text"
          name="tel"
          id="tel"
          spellCheck={false}
          invalid={errors.includes('tel')}
          placeholder="+7 (928) 123-12-12"
          value={player.tel}
          onChange={handleChange}
          mask="+7 (999) 999-99-99"
          tag={InputMask}
        />
        <FormFeedback>Телефон не должен быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          spellCheck={false}
          invalid={errors.includes('email')}
          placeholder="bdoyan@mail.ru"
          value={player.email}
          onChange={handleChange}
        />
        <FormFeedback>Email должен быть корректным</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Ранг</Label>
        <Input
          type="text"
          name="rank"
          id="rank"
          spellCheck={false}
          invalid={errors.includes('rank')}
          placeholder="Гранд-мастер"
          value={player.rank}
          onChange={handleChange}
        />
        <FormFeedback>Ранг не должен быть пустым</FormFeedback>
      </FormGroup>
      <ClubSuggestion addClub={addClub} />
      {player.club && (
        <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
          <Badge
            className="d-inline-flex justify-content-between"
            style={{ width: '100%' }}
            color="dark"
          >
            <h6 style={{ margin: 5 }}>
              {player.club.name.slice(0, 37) === player.club.name
                ? player.club.name
                : player.club.name.slice(0, 37) + '...'}
            </h6>
            <Button
              className="d-flex flex-column align-items-center"
              close
              style={{ color: 'white', height: '100%' }}
              onClick={() => deleteClub()}
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
