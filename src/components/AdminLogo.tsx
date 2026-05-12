'use client'

import Image from 'next/image'

export default function AdminLogo() {
  return (
    <Image
      src="/visit-punta-del-este.svg"
      alt="Visit Punta"
      width={160}
      height={43}
      priority
    />
  )
}
