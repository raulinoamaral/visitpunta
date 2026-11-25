// Booking.com partner id: every link to a hotel on Booking carries it
const BOOKING_AID = '7864342'

export function withBookingAid(url: string): string {
  return url.includes('?') ? `${url}&aid=${BOOKING_AID}` : `${url}?aid=${BOOKING_AID}`
}
