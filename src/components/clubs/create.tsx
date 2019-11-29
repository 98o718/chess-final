import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  FormFeedback,
} from 'reactstrap'
import { Club } from './types'
import { CLUBS_URL } from './constants'
import { useLocation } from 'wouter'
import { toast } from 'react-toastify'

const Create: React.FC = () => {
  const [club, setClub] = useState<Club>({
    id: '',
    name: '',
    address: '',
  })
  const [creating, setCreating] = useState(false)
  const [, setLocation] = useLocation()
  const [errors, setErrors] = useState<string[]>([])
  const [isHandled, setHandled] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setClub(
        Object.assign({}, club, {
          [e.target.name]: e.target.value,
        })
      )
    }
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

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setErrors(validate())
  }, [club, validate, isHandled])

  const handleSubmit = () => {
    setHandled(true)
    if (validate().length === 0) {
      setCreating(true)
      fetch(CLUBS_URL, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ name: club.name, address: club.address }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка создания!')
          toast.success('Клуб создан!')
          setLocation('/list/1')
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
        <Input
          type="text"
          name="name"
          id="name"
          invalid={errors.includes('name')}
          placeholder="Шахматная школа Давида Бдояна"
          value={club.name}
          onChange={handleChange}
        />
        <FormFeedback>Название не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="address">Адрес</Label>
        <Input
          type="text"
          name="address"
          id="address"
          invalid={errors.includes('address')}
          placeholder="Волкова 5/5"
          value={club.address}
          onChange={handleChange}
        />
        <FormFeedback>Адрес не должен быть пустым</FormFeedback>
      </FormGroup>
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
