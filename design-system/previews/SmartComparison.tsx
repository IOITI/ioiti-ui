import { SmartComparison } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="block w-full p-5">
    <SmartComparison
      label="Plans compared"
      plans={[
        { id: 'solo', name: 'Solo', tagline: 'One user', price: '9 €', billingPeriod: 'a month' },
        { id: 'team', name: 'Team', tagline: 'Up to ten', price: '29 €', billingPeriod: 'a month', featured: true, badge: 'Chosen most' },
        { id: 'company', name: 'Company', tagline: 'Everyone', price: '99 €', billingPeriod: 'a month' },
      ]}
      categories={[
        {
          id: 'use',
          title: 'Use',
          features: [
            { id: 'users', name: 'Users', values: { solo: '1', team: '10', company: 'Unlimited' } },
            { id: 'storage', name: 'Storage', values: { solo: '5 GB', team: '50 GB', company: '1 TB' } },
            { id: 'export', name: 'Exports', values: { solo: true, team: true, company: true } },
            { id: 'sso', name: 'Single sign-on', values: { solo: false, team: false, company: true } },
          ],
        },
      ]}
    />
  </div>,
)
