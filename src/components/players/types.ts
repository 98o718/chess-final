export type Player = {
  id: string
  firstName: string
  lastName: string
  address: string
  tel: string
  email: string
  rank: string
  club?: Club
  matches?: Match[]
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

export type Tournament = {
  id: string
  name: string
}

export type Club = {
  id: string
  name: string
}
