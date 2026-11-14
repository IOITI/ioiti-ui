import { Badge, SmartComparison } from 'ioiti-ui'

export default function SmartComparisonOffers() {
  return (
    <SmartComparison
      label="Carriers compared"
      matrixTitle="Carriers"
      countLabel={(count) => `${count} terms`}
      searchPlaceholder="Find a term"
      diffLabel="Only what differs"
      emptyText="No term matches the search."
      plans={[
        // A colour before each name: the carrier's in the charts of the page.
        { id: 'post', name: 'Post', tagline: 'Every address', price: '6.90 €', billingPeriod: 'a parcel', accent: 'var(--chart-compare-1)' },
        { id: 'courier', name: 'Courier', tagline: 'Cities only', price: '12.50 €', billingPeriod: 'a parcel', accent: 'var(--chart-compare-2)', featured: true, badge: 'Fastest' },
        { id: 'freight', name: 'Freight', tagline: 'Pallets', price: '84 €', billingPeriod: 'a pallet', accent: 'var(--chart-compare-3)' },
      ]}
      categories={[
        {
          id: 'delivery',
          title: 'Delivery',
          features: [
            { id: 'days', name: 'Delivered in', values: { post: '2–3 days', courier: 'Same day', freight: '3–5 days' } },
            {
              id: 'tracking',
              name: 'Tracking',
              // A node, and its text to compare for “Only what differs”.
              values: {
                post: <Badge tone="neutral">At each depot</Badge>,
                courier: <Badge tone="success">Live</Badge>,
                freight: <Badge tone="neutral">At each depot</Badge>,
              },
              keys: { post: 'depot', courier: 'live', freight: 'depot' },
            },
            { id: 'saturday', name: 'On Saturdays', values: { post: true, courier: true, freight: false } },
          ],
        },
        {
          id: 'parcel',
          title: 'Parcels',
          features: [
            { id: 'weight', name: 'Heaviest', values: { post: '30 kg', courier: '20 kg', freight: '1,000 kg' } },
            { id: 'insured', name: 'Insured up to', values: { post: '500 €', courier: '2,000 €', freight: '10,000 €' } },
          ],
        },
      ]}
    />
  )
}
