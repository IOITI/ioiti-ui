import { SmartComparison, useToast } from 'ioiti-ui'

export default function SmartComparisonPlans() {
  const toast = useToast()
  const choose = (plan: string) => () => toast({ title: `${plan} chosen`, variant: 'success' })
  return (
    <SmartComparison
      label="Plans compared"
      matrixTitle="Plans"
      countLabel={(count) => `${count} rows`}
      searchPlaceholder="Find a row"
      emptyText="No row matches the search, or none differs."
      plans={[
        { id: 'solo', name: 'Solo', tagline: 'One user', price: '9 €', billingPeriod: 'a month', ctaText: 'Choose Solo', onCtaClick: choose('Solo') },
        { id: 'team', name: 'Team', tagline: 'Up to ten', price: '29 €', billingPeriod: 'a month', featured: true, badge: 'Chosen most', ctaText: 'Choose Team', onCtaClick: choose('Team') },
        { id: 'company', name: 'Company', tagline: 'Everyone', price: '99 €', billingPeriod: 'a month', ctaText: 'Choose Company', onCtaClick: choose('Company') },
      ]}
      categories={[
        {
          id: 'use',
          title: 'Use',
          features: [
            { id: 'users', name: 'Users', values: { solo: '1', team: '10', company: 'Unlimited' } },
            { id: 'storage', name: 'Storage', values: { solo: '5 GB', team: '50 GB', company: '1 TB' } },
            { id: 'export', name: 'Exports', description: 'CSV and PDF, of every list', values: { solo: true, team: true, company: true } },
          ],
        },
        {
          id: 'support',
          title: 'Support',
          features: [
            { id: 'help', name: 'Help by email', values: { solo: true, team: true, company: true } },
            { id: 'answer', name: 'Answered within', values: { solo: '2 days', team: '1 day', company: '4 hours' } },
            { id: 'manager', name: 'A person of your own', values: { solo: false, team: false, company: true } },
          ],
        },
        {
          id: 'security',
          title: 'Security',
          features: [
            { id: 'sso', name: 'Single sign-on', values: { solo: false, team: false, company: true } },
            { id: 'log', name: 'Log of who did what', values: { solo: false, team: true, company: true } },
            { id: 'twofactor', name: 'Two-factor sign-in', values: { solo: true, team: true, company: true } },
          ],
        },
      ]}
    />
  )
}
