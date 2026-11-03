import { notFound } from 'next/navigation'

// Any deeper unknown path renders the localized 404 inside the site layout
export default function CatchAll() {
  notFound()
}
