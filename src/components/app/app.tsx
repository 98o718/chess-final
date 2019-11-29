import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Container, Row, Col } from 'reactstrap'
import { Route, Redirect } from 'wouter'

import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Header } from '../header'
import { ClubsRouter } from '../clubs'

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Container style={{ padding: 30 }}>
        <Row>
          <Col
            className="mx-auto d-flex flex-column align-items-center"
            style={{ maxWidth: '80%' }}
          >
            <Route path="/">
              <Redirect to="/clubs" />
            </Route>

            <ClubsRouter />
            <Route path="/players">ИГРОКИ</Route>
            <Route path="/sponsors">СПОНСОРЫ</Route>
            <Route path="/organizers">ОРГАНИЗАТОРЫ</Route>
            <Route path="/tournaments">ТУРНИРЫ</Route>
            <Route path="/matches">МАТЧИ</Route>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
