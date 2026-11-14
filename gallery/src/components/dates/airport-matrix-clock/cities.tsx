import { AirportMatrixClock } from 'ioiti-ui'

export default function AirportMatrixClockCities() {
  return (
    <AirportMatrixClock
      title={null}
      cities={[
        { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
        { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
        { id: 'tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo' },
      ]}
    />
  )
}
