import { DonutChart } from 'ioiti-ui'

export default function DonutChartPartsOfAWhole() {
  return (
    <DonutChart
      ariaLabel="Orders by channel"
      centerLabel="Orders"
      // Four segments take the compare colours; the fifth and those after it are one segment, in grey.
      data={[
        { label: 'Shop', value: 560 },
        { label: 'Phone', value: 210 },
        { label: 'Partners', value: 190 },
        { label: 'Fairs', value: 80 },
        { label: 'Post', value: 40 },
        { label: 'Other sites', value: 25 },
      ]}
    />
  )
}
