import React, { useState, useEffect } from 'react'
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
  Button,
  Spinner,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Player, Match } from './types'
import { PLAYERS_URL } from './constants'
import { useRoute, useLocation } from 'wouter'
import { toast } from 'react-toastify'
import Skeleton from 'react-loading-skeleton'
import withQuery from 'with-query'
import { MATCHES_URL } from '../matches/constants'
import dayjs from 'dayjs'

const Show: React.FC = () => {
  const [player, setPlayer] = useState<Player>({
    id: '',
    firstName: '',
    lastName: '',
    address: '',
    tel: '',
    email: '',
    rank: '',
  })
  const [tournaments, setTournaments] = useState<
    {
      name: string
      matches: Match[]
    }[]
  >()
  const [, setLocation] = useLocation()
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(false)

  const [, params] = useRoute('/:id/show')

  useEffect(() => {
    let ms: Match[] = []
    fetch(
      withQuery(`${PLAYERS_URL}/${params.id}`, {
        join: 'club',
      })
    )
      .then(r => {
        if (!r.ok)
          return fetch(`${PLAYERS_URL}/${params.id}`).then(r => {
            if (!r.ok) throw new Error('Ошибка загрузки')
            return r.json()
          })
        return r.json()
      })
      .then(data => {
        setPlayer(data)

        ms = data.matches && data.matches

        return fetch(MATCHES_URL)
      })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка загрузки')
        return r.json()
      })
      .then(data => {
        // setMatches(data)

        let t: string[] = []
        let m: Match[] = []
        let ts: { name: string; matches: Match[] }[] = []

        ms.forEach(match => {
          let info = data.find((m: Match) => m.id === match.id)
          m.push(info)
          t.push(info.tournament.name)
        })

        Array.from(new Set(t)).forEach(tournament => {
          let matches = m.filter(
            match => match.tournament && match.tournament.name === tournament
          )
          ts.push({
            name: tournament,
            matches,
          })
        })

        setTournaments(ts)

        setLoading(false)
      })
      .catch(e => {
        toast.error(e.message)
      })
  }, [params.id])

  const remove = () => {
    setRemoving(true)
    fetch(`${PLAYERS_URL}/${player.id}`, { method: 'delete' })
      .then(r => {
        if (!r.ok) throw new Error('Ошибка удаления!')
        toast.success('Игрок удален!')
        setLocation('/list/1')
      })
      .catch(e => {
        setRemoving(false)
        toast.error(e.message)
      })
  }

  return (
    <Card
      className="d-flex flex-column align-items-center"
      style={{ minWidth: 350 }}
    >
      <CardBody style={{ width: '100%' }}>
        <CardText className="d-flex flex-row justify-content-end">
          <Button
            className="d-inline-flex justify-content-center"
            style={{ height: 40, marginRight: 5 }}
            color="primary"
            disabled={loading}
            onClick={() => setLocation(`/${player.id}/edit`)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            className="d-inline-flex justify-content-center"
            style={{ height: 40 }}
            color="danger"
            onClick={() => remove()}
            disabled={removing || loading}
          >
            {removing ? (
              <Spinner color="light" style={{ width: 14, height: 14 }} />
            ) : (
              <FontAwesomeIcon icon={faTrash} />
            )}
          </Button>
        </CardText>
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <CardTitle>
            <h3>{`${player.lastName} ${player.firstName}`}</h3>
          </CardTitle>
        )}
        {loading ? (
          <Skeleton height={35} />
        ) : (
          <CardText>{player.rank}</CardText>
        )}
        <CardSubtitle style={{ marginTop: 5, marginBottom: 5 }}>
          <h6> Контакты:</h6>
        </CardSubtitle>
        {loading ? (
          <>
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </>
        ) : (
          <>
            <CardText>
              {player.address}
              <br />
              {player.tel}
              <br />
              {player.email}
            </CardText>
          </>
        )}
        <CardText>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            player.club && (
              <>
                <h6>Клуб:</h6>
                <Badge
                  className="d-inline-flex justify-content-between"
                  style={{ width: '100%' }}
                  color="info"
                >
                  <h6 style={{ margin: 5 }}>
                    {player.club.name.slice(0, 37) === player.club.name
                      ? player.club.name
                      : player.club.name.slice(0, 37) + '...'}
                  </h6>
                </Badge>
              </>
            )
          )}
        </CardText>
        {!loading && tournaments && tournaments.length > 0 && (
          <CardText>
            <h6>Турниры:</h6>
            {tournaments.map((tournament, idx) => (
              <>
                <Badge
                  key={idx}
                  className="d-inline-flex justify-content-between"
                  style={{ width: '100%' }}
                  color="dark"
                >
                  <h6 style={{ margin: 5 }}>
                    {tournament.name.slice(0, 37) === tournament.name
                      ? tournament.name
                      : tournament.name.slice(0, 37) + '...'}
                  </h6>
                </Badge>
                <ListGroup style={{ marginTop: 15, marginBottom: 15 }}>
                  {tournament.matches.map(match => {
                    return (
                      match.players && (
                        <ListGroupItem>
                          <Badge
                            color="danger"
                            style={{ marginBottom: 10, display: 'block' }}
                          >
                            <h6
                              style={{
                                margin: 5,
                              }}
                            >{`${match.players[0].lastName} ${match.players[0].firstName}`}</h6>
                          </Badge>
                          <h5
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'center',
                            }}
                          >
                            VS
                          </h5>
                          <Badge
                            color="danger"
                            style={{ marginBottom: 5, display: 'block' }}
                          >
                            <h6
                              style={{ margin: 5 }}
                            >{`${match.players[1].lastName} ${match.players[1].firstName}`}</h6>
                          </Badge>
                          Начало:
                          <h6>
                            {dayjs(match.begin).format('DD.MM.YYYY H:mm')}
                          </h6>
                          Конец:
                          <h6>{dayjs(match.end).format('DD.MM.YYYY H:mm')}</h6>
                          Результат:
                          <h6>{match.result}</h6>
                        </ListGroupItem>
                      )
                    )
                  })}
                </ListGroup>
              </>
            ))}
          </CardText>
        )}
      </CardBody>
      {/* <FormGroup style={{ width: '100%' }}>
        <Label for="name">Имя</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
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
        )}
        <FormFeedback>Имя не должно быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Адрес</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
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
        )}
        <FormFeedback>Адрес не должен быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Телефон</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
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
        )}
        <FormFeedback>Телефон не должен быть пустым</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Email</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
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
        )}
        <FormFeedback>Email должен быть корректным</FormFeedback>
      </FormGroup>
      <FormGroup style={{ width: '100%' }}>
        <Label for="name">Ранг</Label>
        {loading ? (
          <Skeleton height={34} />
        ) : (
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
        )}
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
        disabled={editing}
        onClick={handleSubmit}
        style={{ width: 150 }}
      >
        {editing ? (
          <Spinner color="light" style={{ width: 18, height: 18 }} />
        ) : (
          'Сохранить'
        )}
      </Button> */}
    </Card>
  )
}

export default Show
