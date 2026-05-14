'use client'

type Props = {
  href: string
  event: string
  label?: string
  className?: string
  children: React.ReactNode
}

export default function TrackedLink({ href, event, label, className, children }: Props) {
  function handleClick() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_label: label || href,
      })
    }
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
