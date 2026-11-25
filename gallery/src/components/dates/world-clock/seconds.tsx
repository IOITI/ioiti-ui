import { WorldClock } from 'ioiti-ui'

export default function WorldClockSeconds() {
  return (
    <WorldClock
      showSeconds
      format="12h"
      title="Support desks"
      footer="5 desks · open 9 am to 6 pm, local time"
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
