import type { Image } from './shared'

export interface User {
  display_name: string
  href: string
  id: string
  images: Image[]
  type: 'user'
  uri: string
}
