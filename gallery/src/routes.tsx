import type { Menu, MenuEntry } from 'ioiti-ui'
import {
  Accessibility,
  BellRing,
  BookOpen,
  ChartLine,
  ChartPie,
  Compass,
  Inbox,
  Layers,
  LayoutDashboard,
  LogIn,
  MousePointerClick,
  Palette,
  PanelsTopLeft,
  Shapes,
  Sheet,
  SearchX,
  TextCursorInput,
  Type,
  Wind,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Actions } from './pages/Actions'
import { ChartColours } from './pages/ChartColours'
import { Charts } from './pages/Charts'
import { Colours } from './pages/Colours'
import { DashboardPattern } from './pages/DashboardPattern'
import { DataDisplay } from './pages/DataDisplay'
import { Feedback } from './pages/Feedback'
import { Forms } from './pages/Forms'
import { GettingStarted } from './pages/GettingStarted'
import { Motion } from './pages/Motion'
import { Navigation } from './pages/Navigation'
import { NotFoundPattern } from './pages/NotFoundPattern'
import { Overlays } from './pages/Overlays'
import { Shape } from './pages/Shape'
import { Shell } from './pages/Shell'
import { SignInPattern } from './pages/SignInPattern'
import { States } from './pages/States'
import { Typography } from './pages/Typography'
import { UsableByAll } from './pages/UsableByAll'

export type Section = 'Overview' | 'Foundations' | 'Components' | 'Patterns'

export interface GalleryPage extends MenuEntry<Section> {
  element: ReactNode
  /** Drawn outside the shell, as a sign-in page is. */
  bare?: boolean
}

export const PAGES: GalleryPage[] = [
  { id: 'start', path: '/', label: 'Getting started', section: 'Overview', icon: <BookOpen />, element: <GettingStarted /> },
  { id: 'colours', path: '/foundations/colours', label: 'Colours', section: 'Foundations', icon: <Palette />, element: <Colours /> },
  { id: 'type', path: '/foundations/type', label: 'Type', section: 'Foundations', icon: <Type />, element: <Typography /> },
  { id: 'shape', path: '/foundations/shape', label: 'Surfaces and shape', section: 'Foundations', icon: <Shapes />, element: <Shape /> },
  { id: 'motion', path: '/foundations/motion', label: 'Motion', section: 'Foundations', icon: <Wind />, element: <Motion /> },
  { id: 'usable', path: '/foundations/usable-by-all', label: 'Usable by all', section: 'Foundations', icon: <Accessibility />, element: <UsableByAll /> },
  { id: 'chart-colours', path: '/foundations/chart-colours', label: 'Chart colours', section: 'Foundations', icon: <ChartPie />, element: <ChartColours /> },
  { id: 'shell', path: '/components/shell', label: 'Shell', section: 'Components', icon: <PanelsTopLeft />, element: <Shell /> },
  { id: 'actions', path: '/components/actions', label: 'Actions', section: 'Components', icon: <MousePointerClick />, element: <Actions /> },
  { id: 'forms', path: '/components/forms', label: 'Forms', section: 'Components', icon: <TextCursorInput />, element: <Forms /> },
  { id: 'feedback', path: '/components/feedback', label: 'Feedback', section: 'Components', icon: <BellRing />, element: <Feedback /> },
  { id: 'overlays', path: '/components/overlays', label: 'Overlays', section: 'Components', icon: <Layers />, element: <Overlays /> },
  { id: 'navigation', path: '/components/navigation', label: 'Navigation', section: 'Components', icon: <Compass />, element: <Navigation /> },
  { id: 'data', path: '/components/data', label: 'Data display', section: 'Components', icon: <Sheet />, element: <DataDisplay /> },
  { id: 'charts', path: '/components/charts', label: 'Charts', section: 'Components', icon: <ChartLine />, element: <Charts /> },
  { id: 'dashboard', path: '/patterns/dashboard', label: 'Dashboard', section: 'Patterns', icon: <LayoutDashboard />, element: <DashboardPattern /> },
  { id: 'states', path: '/patterns/states', label: 'Empty, loading, failed', section: 'Patterns', icon: <Inbox />, element: <States /> },
  { id: 'sign-in', path: '/patterns/sign-in', label: 'Sign-in page', section: 'Patterns', icon: <LogIn />, element: <SignInPattern />, bare: true },
  { id: 'not-found', path: '/patterns/not-found', label: 'Page not found', section: 'Patterns', icon: <SearchX />, element: <NotFoundPattern /> },
]

export const MENU: Menu<Section> = {
  sections: ['Overview', 'Foundations', 'Components', 'Patterns'],
  entries: PAGES,
}
