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
import { Organizer } from './types'
import { ORGANIZERS_URL } from './constants'
import { useLocation } from 'wouter'
import { toast } from 'react-toastify'

const Create: React.FC = () => {
  const [organizer, setOrganizer] = useState<Organizer>({
    id: '',
    name: '',
  })
  const [creating, setCreating] = useState(false)
  const [, setLocation] = useLocation()
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setOrganizer(
        Object.assign({}, organizer, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const validate = useCallback(() => {
    let errors: string[] = []
    if (!organizer.name.trim()) {
      errors.push('name')
    }
    return errors
  }, [organizer])

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setErrors(validate())
  }, [organizer, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setCreating(true)
      fetch(ORGANIZERS_URL, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ name: organizer.name.trim() }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка создания!')
          toast.success('Организатор создан!')
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
          spellCheck={false}
          invalid={errors.includes('name')}
          placeholder="CHESSSchool"
          value={organizer.name}
          onChange={handleChange}
          onKeyDown={e => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        />
        <FormFeedback>Название не должно быть пустым</FormFeedback>
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
