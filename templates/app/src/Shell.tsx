import { LookPicker, SidebarFooterButton, ThemeToggle } from 'ioiti-ui'
import { RouterAppShell } from 'ioiti-ui/react-router'
import { LogOut } from 'lucide-react'
import { useNavigate, useNavigation } from 'react-router'

import { version } from '../package.json'
import { MENU } from './menu'

function SignOut() {
  const navigate = useNavigate()
  return <SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={() => void navigate('/login')} />
}

/** The shell, which shows a thin bar under the top bar while the next page loads (its code, its data). */
export function Shell() {
  const navigation = useNavigation()
  return (
    <RouterAppShell
      menu={MENU}
      appDetail={`v${version}`}
      sidebarFooter={<SignOut />}
      pending={navigation.state === 'loading'}
      // The top bar ends with the accent and material (each person's own), then the theme.
      topBarEnd={
        <>
          <LookPicker />
          <ThemeToggle />
        </>
      }
    />
  )
}
