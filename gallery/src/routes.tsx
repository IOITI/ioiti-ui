import type { Menu, MenuEntry, MenuSection } from 'ioiti-ui'
import {
  Accessibility,
  BookOpen,
  ChartPie,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  Palette,
  SearchX,
  Settings,
  Shapes,
  SwatchBook,
  Type,
  Wind,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { CATEGORIES, categoryPath, COMPONENTS_PATH, familyPath } from './catalogue/catalogue'
import { ComponentIndex } from './catalogue/ComponentIndex'
import type { CategoryInfo, FamilyInfo } from './catalogue/types'
import { ChartColours } from './pages/ChartColours'
import { Colours } from './pages/Colours'
import { DashboardPattern } from './pages/DashboardPattern'
import { GettingStarted } from './pages/GettingStarted'
import { Motion } from './pages/Motion'
import { NotFoundPattern } from './pages/NotFoundPattern'
import { Shape } from './pages/Shape'
import { SettingsPattern } from './pages/SettingsPattern'
import { SignInPattern } from './pages/SignInPattern'
import { States } from './pages/States'
import { Themes } from './pages/Themes'
import { Typography } from './pages/Typography'
import { UsableByAll } from './pages/UsableByAll'

export type Section = 'Overview' | 'Foundations' | 'Components' | 'Patterns'

/** A page of the gallery: drawn as it is (`element`), or a category's or a component's (loaded with its category). */
export interface GalleryPage extends MenuEntry<Section> {
  element?: ReactNode
  category?: CategoryInfo
  family?: FamilyInfo
  /** Drawn outside the shell, as a sign-in page is. */
  bare?: boolean
}

const OVERVIEW: GalleryPage[] = [
  { id: '/', path: '/', label: 'Getting started', section: 'Overview', icon: <BookOpen />, element: <GettingStarted /> },
  { id: COMPONENTS_PATH, path: COMPONENTS_PATH, label: 'All components', section: 'Overview', icon: <LayoutGrid />, element: <ComponentIndex /> },
]

const FOUNDATIONS: GalleryPage[] = [
  { id: '/foundations/colours', path: '/foundations/colours', label: 'Colours', section: 'Foundations', icon: <Palette />, element: <Colours /> },
  { id: '/foundations/themes', path: '/foundations/themes', label: 'Themes', section: 'Foundations', icon: <SwatchBook />, element: <Themes /> },
  { id: '/foundations/type', path: '/foundations/type', label: 'Type', section: 'Foundations', icon: <Type />, element: <Typography /> },
  { id: '/foundations/shape', path: '/foundations/shape', label: 'Surfaces and shape', section: 'Foundations', icon: <Shapes />, element: <Shape /> },
  { id: '/foundations/motion', path: '/foundations/motion', label: 'Motion', section: 'Foundations', icon: <Wind />, element: <Motion /> },
  { id: '/foundations/usable-by-all', path: '/foundations/usable-by-all', label: 'Usable by all', section: 'Foundations', icon: <Accessibility />, element: <UsableByAll /> },
  { id: '/foundations/chart-colours', path: '/foundations/chart-colours', label: 'Chart colours', section: 'Foundations', icon: <ChartPie />, element: <ChartColours /> },
]

/** Each category, its components under it. */
const COMPONENTS: GalleryPage[] = CATEGORIES.flatMap((category) => {
  const Icon = category.icon
  const path = categoryPath(category)
  return [
    { id: path, path, label: category.label, section: 'Components' as const, icon: <Icon />, category },
    ...category.families.map((family) => ({
      id: familyPath(category, family),
      path: familyPath(category, family),
      label: family.name,
      section: 'Components' as const,
      parent: path,
      category,
      family,
    })),
  ]
})

const PATTERNS: GalleryPage[] = [
  { id: '/patterns/dashboard', path: '/patterns/dashboard', label: 'Dashboard', section: 'Patterns', icon: <LayoutDashboard />, element: <DashboardPattern /> },
  { id: '/patterns/states', path: '/patterns/states', label: 'Empty, loading, failed', section: 'Patterns', icon: <Inbox />, element: <States /> },
  { id: '/patterns/settings', path: '/patterns/settings', label: 'Settings page', section: 'Patterns', icon: <Settings />, element: <SettingsPattern /> },
  { id: '/patterns/sign-in', path: '/patterns/sign-in', label: 'Sign-in page', section: 'Patterns', icon: <LogIn />, element: <SignInPattern />, bare: true },
  { id: '/patterns/not-found', path: '/patterns/not-found', label: 'Page not found', section: 'Patterns', icon: <SearchX />, element: <NotFoundPattern /> },
]

export const PAGES: GalleryPage[] = [...OVERVIEW, ...FOUNDATIONS, ...COMPONENTS, ...PATTERNS]

const SECTIONS: MenuSection<Section>[] = [
  { id: 'Overview', title: false },
  { id: 'Foundations', foldable: true },
  { id: 'Components' },
  { id: 'Patterns', foldable: true },
]

export const MENU: Menu<Section> = { sections: SECTIONS, entries: PAGES }
