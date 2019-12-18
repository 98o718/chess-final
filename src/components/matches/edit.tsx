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
import { Tournament, Player, Match } from './types'
import { MATCHES_URL } from './constants'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import { TournamentSuggestion, PlayerSuggestion } from '.'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Edit: React.FC = () => {
  const [match, setMatch] = useState<Match>({
    id: '',
    begin: new Date(),
    end: dayjs(new Date())
      .add(1, 'day')
      .toDate(),
    result: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const [, params] = useRoute('/:id/edit')

  useEffect(() => {
    fetch(`${MATCHES_URL}/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Ошибка загрузки!')
        return r.json()
      })
      .then(data => {
        setMatch({
          ...data,
          begin: new Date(data.begin),
          end: new Date(data.end),
          player1: data.players[0],
          player2: data.players[1],
        })
        setLoading(false)
      })
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setMatch(
        Object.assign({}, match, {
          [e.target.name]: e.target.value,
        })
      )
    }
  }

  const handleBeginChange = (date: Date) => {
    setMatch(
      Object.assign({}, match, {
        begin: date,
      })
    )
  }

  const handleEndChange = (date: Date) => {
    setMatch(
      Object.assign({}, match, {
        end: date,
      })
    )
  }

  const addTournament = (tournament: Tournament) => {
    setMatch(
      Object.assign({}, match, {
        begin: new Date(tournament.begin),
        end: new Date(tournament.end),
        tournament,
      })
    )
  }

  const deleteTournament = () => {
    setMatch(
      Object.assign({}, match, {
        tournament: undefined,
      })
    )
  }

  const addPlayer1 = (player1: Player) => {
    if (match.player2 && player1.id === match.player2.id)
      return toast.info('Игроки должны быть разными!')
    setMatch(
      Object.assign({}, match, {
        player1,
      })
    )
  }

  const deletePlayer1 = () => {
    setMatch(
      Object.assign({}, match, {
        player1: undefined,
      })
    )
  }

  const addPlayer2 = (player2: Player) => {
    if (match.player1 && player2.id === match.player1.id)
      return toast.info('Игроки должны быть разными!')
    setMatch(
      Object.assign({}, match, {
        player2,
      })
    )
  }

  const deletePlayer2 = () => {
    setMatch(
      Object.assign({}, match, {
        player2: undefined,
      })
    )
  }

  const validate = useCallback(() => {
    console.log(match)
    let errors: string[] = []
    if (!match.result.trim()) {
      errors.push('result')
    }
    if (
      !match.begin ||
      dayjs(match.end).diff(dayjs(match.begin), 'minute') < 0
    ) {
      toast.error(
        'Начало не должно быть пустым, раньше начала турнира и позже конца'
      )
      errors.push('begin')
    }
    if (!match.end || dayjs(match.end).diff(dayjs(match.begin), 'minute') < 0) {
      toast.error(
        'Конец не должен быть пустым, позже конца турнира и раньше начала'
      )
      errors.push('end')
    }
    if (!match.tournament) {
      errors.push('tournament')
    }
    if (!match.player1) {
      errors.push('player1')
    }
    if (!match.player2) {
      errors.push('player2')
    }
    if (
      match.player1 &&
      match.player1.matches &&
      match.player1.matches.length > 0
    ) {
      match.player1.matches.forEach(playersMatch => {
        if (
          !(
            (dayjs(match.begin).isBefore(dayjs(playersMatch.begin)) &&
              dayjs(match.end).isBefore(dayjs(playersMatch.begin))) ||
            (dayjs(match.begin).isAfter(dayjs(playersMatch.begin)) &&
              dayjs(match.end).isAfter(dayjs(playersMatch.begin)))
          ) &&
          match.id !== playersMatch.id
        ) {
          errors.push('begin')
          errors.push('end')
          toast.error('Игрок не может играть в одно время в нескольких матчах!')
        }
      })
    }
    if (
      match.player2 &&
      match.player2.matches &&
      match.player2.matches.length > 0
    ) {
      match.player2.matches.forEach(playersMatch => {
        if (
          !(
            (dayjs(match.begin).isBefore(dayjs(playersMatch.begin)) &&
              dayjs(match.end).isBefore(dayjs(playersMatch.begin))) ||
            (dayjs(match.begin).isAfter(dayjs(playersMatch.begin)) &&
              dayjs(match.end).isAfter(dayjs(playersMatch.begin)))
          ) &&
          match.id !== playersMatch.id
        ) {
          errors.push('begin')
          errors.push('end')
          toast.error('Игрок не может играть в одно время в нескольких матчах!')
        }
      })
    }
    return errors
  }, [match])

  useEffect(() => {
    setErrors(validate())
  }, [match, validate])

  const handleSubmit = () => {
    if (validate().length === 0) {
      setEditing(true)
      fetch(MATCHES_URL, {
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          begin: match.begin,
          end: match.end,
          tournament: match.tournament,
          result: match.result.trim(),
          players: [match.player1, match.player2],
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Ошибка создания!')
          toast.success('Матч создан!')
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
        <Label for="name">Результат</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
          <Input
            type="text"
            name="result"
            id="result"
            spellCheck={false}
            invalid={errors.includes('result')}
            placeholder="Победа 1 игрока"
            value={match.result}
            onChange={handleChange}
            onKeyDown={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          />
        )}
        <FormFeedback>Результат не должен быть пустым</FormFeedback>
      </FormGroup>
      <TournamentSuggestion
        disabled={loading || editing}
        addTournament={addTournament}
      />
      {loading ? (
        <>
          <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
            <Skeleton height={34} />
          </FormGroup>
          <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
            <Label for="name">Начало</Label>
            <Skeleton height={34} />
          </FormGroup>
          <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
            <Label for="name">Конец</Label>
            <Skeleton height={34} />
          </FormGroup>
        </>
      ) : (
        match.tournament && (
          <>
            <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
              <Badge
                className="d-inline-flex justify-content-between"
                style={{ width: '100%' }}
                color="dark"
              >
                {match.tournament && (
                  <h6 style={{ margin: 5 }}>
                    {match.tournament.name.slice(0, 37) ===
                    match.tournament.name
                      ? match.tournament.name
                      : match.tournament.name.slice(0, 37) + '...'}
                  </h6>
                )}
                <Button
                  className="d-flex flex-column align-items-center"
                  close
                  style={{ color: 'white', height: '100%' }}
                  onClick={() => deleteTournament()}
                />
              </Badge>
            </FormGroup>
            <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
              <Label for="name">Начало</Label>
              <DatePicker
                selected={match.begin}
                onChange={handleBeginChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                className={`form-control ${errors.includes('begin') &&
                  'is-invalid'}`}
                dateFormat="dd.MM.yyyy H:mm"
                minDate={new Date(match.tournament.begin)}
                maxDate={match.end ? new Date(match.end) : match.tournament.end}
              />
            </FormGroup>
            <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
              <Label for="name">Конец</Label>
              <DatePicker
                selected={match.end}
                onChange={handleEndChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                className={`form-control ${errors.includes('end') &&
                  'is-invalid'}`}
                dateFormat="dd.MM.yyyy H:mm"
                maxDate={new Date(match.tournament.end)}
                minDate={
                  match.begin ? new Date(match.begin) : match.tournament.begin
                }
              />
              <FormFeedback>
                Конец не должен быть пустым и быть раньше начала
              </FormFeedback>
            </FormGroup>
          </>
        )
      )}

      <PlayerSuggestion disabled={loading || editing} addPlayer={addPlayer1} />
      {!loading ? (
        match.player1 && (
          <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
            <Badge
              className="d-inline-flex justify-content-between"
              style={{ width: '100%' }}
              color="dark"
            >
              <h6 style={{ margin: 5 }}>
                {match.player1.lastName.slice(0, 37) === match.player1.lastName
                  ? match.player1.lastName
                  : match.player1.lastName.slice(0, 37) + '...'}
              </h6>
              <Button
                className="d-flex flex-column align-items-center"
                close
                style={{ color: 'white', height: '100%' }}
                onClick={() => deletePlayer1()}
              />
            </Badge>
          </FormGroup>
        )
      ) : (
        <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
          <Skeleton height={34} />
        </FormGroup>
      )}

      <PlayerSuggestion disabled={loading || editing} addPlayer={addPlayer2} />
      {!loading ? (
        match.player2 && (
          <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
            <Badge
              className="d-inline-flex justify-content-between"
              style={{ width: '100%' }}
              color="dark"
            >
              <h6 style={{ margin: 5 }}>
                {match.player2.lastName.slice(0, 37) === match.player2.lastName
                  ? match.player2.lastName
                  : match.player2.lastName.slice(0, 37) + '...'}
              </h6>
              <Button
                className="d-flex flex-column align-items-center"
                close
                style={{ color: 'white', height: '100%' }}
                onClick={() => deletePlayer2()}
              />
            </Badge>
          </FormGroup>
        )
      ) : (
        <FormGroup className="d-flex flex-column" style={{ width: '100%' }}>
          <Skeleton height={34} />
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
