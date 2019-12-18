import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Container, Row, Col } from 'reactstrap'
import { Route, Redirect } from 'wouter'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Header } from '../header'
import { ClubsRouter } from '../clubs'
import { SponsorsRouter } from '../sponsors'
import { OrganizersRouter } from '../organizers'
import { PlayersRouter } from '../players'
import { TournamentsRouter } from '../tournaments'
import { MatchesRouter } from '../matches'

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Container
        style={{ paddingTop: 30, paddingBottom: 30, maxWidth: '100%' }}
      >
        <Row>
          <Col
            className="mx-auto d-flex flex-column align-items-center"
            style={{ maxWidth: '100%' }}
          >
            <Route path="/">
              <Redirect to="/clubs" />
            </Route>

            <ClubsRouter />
            <PlayersRouter />
            <SponsorsRouter />
            <OrganizersRouter />
            <TournamentsRouter />
            <MatchesRouter />
          </Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
