export type Player = {
  id: string
  lastName: string
  firstName: string
}

export type Sponsor = {
  id: string
  name: string
}

export type Organizer = {
  id: string
  name: string
}

export type Tournament = {
  id: string
  name: string
  begin: Date
  end: Date
  sponsors?: Sponsor[]
  players?: Player[]
  organizer?: Organizer
}
