export type Club = {
  id: string
  name: string
  address: string
  players?: {
    id: string
    lastName: string
  }
}
