export type Sponsor = {
  id: string
  name: string
  tournaments?: Tournament[]
}

export type Tournament = {
  id: string
  name: string
}
