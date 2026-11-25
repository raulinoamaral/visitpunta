// What every card in the section pages needs: built once on the server, passed to client lists as plain data
export type SectionItem = {
  id: string
  title: string
  href: string
  image: string
  alt: string
  /** Zone or type, small caps above the title */
  label?: string
  summary?: string
  /** Booking link with the partner id, for hotels */
  booking?: string | null
}
