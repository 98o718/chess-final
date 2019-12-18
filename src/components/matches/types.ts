export type Player = {
  id: string
  lastName: string
  firstName: string
  matches: Match[]
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

export type Match = {
  id: string
  begin: Date
  end: Date
  result: string
  player1?: Player
  player2?: Player
  players?: Player[]
  tournament?: Tournament
}
