import React, { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import { Link, useLocation } from 'wouter'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [location] = useLocation()

  const toggle = () => setIsOpen(!isOpen)
  return (
    <Navbar
      color="light"
      light
      expand="md"
      style={{ paddingLeft: 50, paddingRight: 50 }}
    >
      <NavbarBrand href="/">♟</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              tag={Link}
              href="/clubs"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/clubs')}
            >
              Клубы
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              href="/players"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/players')}
            >
              Игроки
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              href="/sponsors"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/sponsors')}
            >
              Спонсоры
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              href="/organizers"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/organizers')}
            >
              Организаторы
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              href="/tournaments"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/tournaments')}
            >
              Турниры
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={Link}
              href="/matches"
              onClick={() => setIsOpen(false)}
              active={location.startsWith('/matches')}
            >
              Матчи
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header
