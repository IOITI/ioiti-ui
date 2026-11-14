import { AirportMatrixClock } from 'ioiti-ui'

export default function AirportMatrixClockSeconds() {
  return (
    <AirportMatrixClock
      showSeconds
      format="12h"
      title="SUPPORT DESKS"
      footer="5 DESKS · OPEN 9 AM TO 6 PM, LOCAL TIME"
      cities={[
        { id: 'lisbon', name: 'Lisbon', timeZone: 'Europe/Lisbon' },
        { id: 'berlin', name: 'Berlin', timeZone: 'Europe/Berlin' },
        { id: 'dubai', name: 'Dubai', timeZone: 'Asia/Dubai' },
        { id: 'singapore', name: 'Singapore', timeZone: 'Asia/Singapore' },
        { id: 'sydney', name: 'Sydney', timeZone: 'Australia/Sydney' },
      ]}
    />
  )
}
