import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { HealthStatus } from '../lib/health.js'
import { bindMessages } from '../lib/messages.js'
import { summariseStatusHistory } from '../lib/status-history.js'
import { fr } from '../locales/fr.js'
import { AvatarGroup } from './Avatar.js'
import { ChangeList } from './ChangeList.js'
import { ChartLegend } from './ChartLegend.js'
import { CodeBlock } from './CodeBlock.js'
import { CopyButton } from './CopyButton.js'
import { CopyChip } from './CopyChip.js'
import { ExportButton } from './ExportButton.js'
import { InlineEdit } from './InlineEdit.js'
import { IoitiProvider } from './IoitiProvider.js'
import { LiveValue } from './LiveValue.js'
import type { MessagesOverride } from './locale-context.js'
import { MultiSelect } from './MultiSelect.js'
import { ResizableHandle, ResizablePanel, ResizablePanels } from './ResizablePanels.js'
import { SaveBar } from './SaveBar.js'
import { QueryState, SignedValue, StatusBadge } from './status.js'
import { StatusHistory } from './StatusHistory.js'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table.js'
import { AdvancedDataTable } from './ui/advanced-data-table.js'
import type { ColumnDef } from './ui/advanced-data-table.js'
import { Alert } from './ui/alert.js'
import { Badge } from './ui/badge.js'
import { Combobox } from './ui/combobox.js'
import { DependencyTrace } from './ui/dependency-trace.js'
import { Input } from './ui/form.js'
import { InteractiveTimeline } from './ui/interactive-timeline.js'
import { Loader } from './ui/loader.js'
import { OTPInput } from './ui/otp-input.js'
import { PeekCard } from './ui/peek-card.js'
import { ScrollProgressNav } from './ui/scroll-progress-nav.js'
import { SelectionBasket } from './ui/selection-basket.js'
import { SkeletonReveal } from './ui/skeleton.js'
import { SmartComparison } from './ui/smart-comparison.js'
import { SpringSelect } from './ui/spring-select.js'
import { Stepper } from './ui/stepper.js'

/** French's no-break spaces (before a colon, inside guillemets, between groups of digits) read as spaces. */
const spaced = (text: string | null | undefined) => (text ?? '').replace(/[\u00a0\u202f]/g, ' ')
/** A role's name, its no-break spaces read as spaces. */
const named = (expected: string) => (name: string) => spaced(name) === expected
/** Text, its no-break spaces read as spaces. */
const saying = (expected: string) => (_: string, element: Element | null) =>
  !!element && spaced(element.textContent) === expected && Array.from(element.children).every((child) => spaced(child.textContent) !== expected)

function French({ children }: { children: ReactNode }) {
  return (
    <IoitiProvider locale="fr-FR" messages={fr}>
      {children}
    </IoitiProvider>
  )
}

/** An application's own words, given over English's: a constant, as IoitiProvider asks. */
const OWN_WORDS: MessagesOverride = {
  table: { nextPage: 'Onwards', basketClear: 'Empty the basket', changeNew: 'Added' },
  select: { choosePlaceholder: 'Pick cities', placeholder: 'Pick one' },
  field: { copy: 'Copy it', exportCsv: 'Download the rows' },
  status: { healthDown: 'Offline', historyEmpty: 'Nothing recorded' },
  layout: { people: 'Team', contents: 'On this page' },
}

function Own({ children }: { children: ReactNode }) {
  return <IoitiProvider messages={OWN_WORDS}>{children}</IoitiProvider>
}

// jsdom lays nothing out: a frame that scrolls (overflow-auto, overflow-x-auto) shows 400 px of 640.
function framesScroll() {
  const frame = (element: Element) => element.classList.contains('overflow-x-auto') || element.classList.contains('overflow-auto')
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
    return frame(this) ? 400 : 0
  })
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return frame(this) ? 640 : 0
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

interface Order {
  id: string
  name: string
  kind: string
  group: string
}

const ORDERS: Order[] = Array.from({ length: 12 }, (_, index) => ({
  id: `c${index + 1}`,
  name: `Commande ${index + 1}`,
  kind: index % 2 === 0 ? 'pair' : 'impair',
  group: index < 6 ? 'a' : index < 9 ? 'b' : 'c',
}))
const COLUMNS: ColumnDef<Order>[] = [
  { id: 'name', header: 'Nom', accessorKey: 'name' },
  { id: 'kind', header: 'Type', accessorKey: 'kind', filterable: true, filterOptions: [{ label: 'Pair', value: 'pair' }, { label: 'Impair', value: 'impair' }] },
  { id: 'group', header: 'Groupe', accessorKey: 'group', filterable: true, filterOptions: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }] },
]
const SEARCHED: ColumnDef<Order>[] = [
  { id: 'name', header: 'Nom', accessorKey: 'name', filterable: true, filterOptions: ORDERS.map((order) => ({ label: order.name, value: order.name })) },
]
const MANY: Order[] = Array.from({ length: 1200 }, (_, index) => ({ id: `m${index + 1}`, name: `Commande ${index + 1}`, kind: 'pair', group: 'a' }))

describe('the tables in French', () => {
  it('count the records as French writes numbers, each figure in its span, and name the pages and the toolbar', async () => {
    const user = userEvent.setup()
    const { container } = render(<AdvancedDataTable data={MANY} columns={COLUMNS.slice(0, 1)} onBulkDelete={() => {}} />, { wrapper: French })

    expect(spaced(container.textContent)).toContain('1–10 sur 1 200 enregistrements')
    expect(screen.getByText(saying('1 200'))).toHaveClass('font-medium')
    expect(screen.getByText(saying('Lignes par page :'))).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Lignes par page' })).toBeInTheDocument()
    for (const name of ['Première page', 'Page précédente', 'Page suivante', 'Dernière page', 'Afficher en cartes', 'Colonnes affichées']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getByPlaceholderText('Rechercher…')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Sélectionner la ligne m1' }))
    await user.click(screen.getByRole('checkbox', { name: 'Sélectionner la ligne m2' }))
    expect(screen.getByText('2 sélectionnés')).toBeInTheDocument()
    expect(screen.getByText(saying('2 éléments sélectionnés :'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Sélectionner toutes les lignes' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Colonnes affichées' }))
    const picker = screen.getByRole('dialog', { name: 'Colonnes affichées' })
    expect(within(picker).getByText('Colonnes')).toBeInTheDocument()
  })

  it('say a record in the singular, and its count of one', () => {
    const { container } = render(<AdvancedDataTable data={ORDERS.slice(0, 1)} columns={COLUMNS.slice(0, 1)} />, { wrapper: French })
    expect(spaced(container.textContent)).toContain('1–1 sur 1 enregistrement')
    const english = render(<AdvancedDataTable data={ORDERS.slice(0, 1)} columns={COLUMNS.slice(0, 1)} />)
    expect(english.container.textContent).toContain('Showing 1–1 of 1 record')
  })

  it('name their filters, their options, what they leave and what they find', async () => {
    const user = userEvent.setup()
    render(<AdvancedDataTable data={ORDERS} columns={COLUMNS} />, { wrapper: French })

    expect(screen.getByRole('group', { name: 'Filtres' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: named('Type : Impair') }))
    const list = screen.getByRole('button', { name: 'Groupe, 3 options' })
    await user.click(list)
    const options = await screen.findByRole('group', { name: 'Filtrer par Groupe' })
    // Under the other filter: six odd rows, three in A.
    expect(within(options).getByText(', 3 lignes')).toBeInTheDocument()
    await user.click(within(options).getAllByRole('checkbox')[0])
    expect(screen.getByRole('button', { name: 'Groupe, 1 sur 3 sélectionnée' })).toBeInTheDocument()
    expect(within(options).getByRole('button', { name: 'Effacer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Effacer les filtres' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await user.type(screen.getByPlaceholderText('Rechercher…'), 'zzz')
    expect(screen.getByRole('heading', { name: 'Aucun enregistrement ne correspond' })).toBeInTheDocument()
    expect(screen.getByText('Rien ne correspond à la recherche ou aux filtres.')).toBeInTheDocument()
  })

  it('search a long list of options in French', async () => {
    const user = userEvent.setup()
    render(<AdvancedDataTable data={ORDERS} columns={SEARCHED} />, { wrapper: French })
    await user.click(screen.getByRole('button', { name: 'Nom, 12 options' }))
    const search = await screen.findByRole('searchbox', { name: named('Rechercher dans les options du filtre « Nom »') })
    expect(search).toHaveAttribute('placeholder', 'Rechercher…')
    await user.type(search, 'zzz')
    expect(screen.getByText('Aucune option ne correspond.')).toBeInTheDocument()
  })

  it('say what they show without rows, loading or failing, and name a row by its own name', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<AdvancedDataTable data={[]} columns={COLUMNS} />, { wrapper: French })
    expect(screen.getByRole('heading', { name: 'Rien à afficher' })).toBeInTheDocument()

    rerender(<AdvancedDataTable data={[]} columns={COLUMNS} isLoading />)
    expect(screen.getByRole('status', { name: 'Chargement des enregistrements' })).toBeInTheDocument()
    expect(screen.getByText('Chargement…')).toBeInTheDocument()

    rerender(<AdvancedDataTable data={[]} columns={COLUMNS} error="Délai dépassé" />)
    expect(screen.getByText('Échec du chargement des données')).toBeInTheDocument()

    rerender(<AdvancedDataTable data={ORDERS} columns={COLUMNS} rowLabel={(order) => order.name} renderSubComponent={(order) => <p>Détails de {order.name}</p>} />)
    expect(screen.getByRole('checkbox', { name: 'Sélectionner Commande 1' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ouvrir Commande 1' }))
    expect(screen.getByRole('button', { name: 'Fermer Commande 1' })).toBeInTheDocument()

    rerender(<AdvancedDataTable data={ORDERS} columns={COLUMNS} renderSubComponent={(order) => <p>Détails de {order.name}</p>} />)
    expect(screen.getAllByRole('button', { name: 'Afficher les détails de la ligne' }).length).toBeGreaterThan(0)
  })

  it('give a selection basket its words: its noun or the provider\'s, agreeing with the count', () => {
    const { rerender } = render(<SelectionBasket selectedCount={1} totalCount={24} onSelectAll={() => {}} onClearSelection={() => {}} />, {
      wrapper: French,
    })
    const bar = screen.getByRole('toolbar', { name: 'Barre d’actions groupées' })
    expect(within(bar).getByText('élément sélectionné')).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Tout sélectionner (24)' })).toBeInTheDocument()
    for (const name of ['Exporter', 'Déplacer vers un dossier', 'Partager', 'Supprimer', 'Effacer la sélection']) {
      expect(within(bar).getByRole('button', { name })).toBeInTheDocument()
    }

    rerender(<SelectionBasket selectedCount={3} totalCount={24} onSelectAll={() => {}} />)
    expect(screen.getByText('éléments sélectionnés')).toBeInTheDocument()

    rerender(<SelectionBasket selectedCount={3} totalCount={3} allSelected onSelectAll={() => {}} noun={['ligne', 'lignes']} />)
    expect(screen.getByText('lignes dans la sélection')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tout désélectionner' })).toBeInTheDocument()
  })

  it('compare plans in French, its rows counted', async () => {
    const user = userEvent.setup()
    const plans = [
      { id: 'base', name: 'Base', tagline: 'Pour commencer', price: '0 €' },
      { id: 'pro', name: 'Pro', tagline: 'Pour une équipe', price: '20 €', onCtaClick: () => {} },
    ]
    const categories = [
      {
        id: 'acces',
        title: 'Accès',
        features: [{ id: 'sso', name: 'SSO', description: 'Connexion unique', values: { base: false, pro: true } }],
      },
    ]
    render(<SmartComparison plans={plans} categories={categories} />, { wrapper: French })

    expect(screen.getByRole('table', { name: 'Comparaison des fonctionnalités et des offres' })).toBeInTheDocument()
    expect(screen.getByText('Matrice des fonctionnalités')).toBeInTheDocument()
    expect(screen.getByText('1 spécification')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Commencer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Informations sur SSO' })).toBeInTheDocument()
    expect(screen.getAllByText(saying('Pro :')).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Différences uniquement' })).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Filtrer les fonctionnalités…' }), 'zzz')
    expect(screen.getByText('Aucune fonctionnalité ne correspond à la recherche ou au filtre des différences.')).toBeInTheDocument()
  })

  it('count one row of a comparison in the singular in English too', () => {
    render(<SmartComparison plans={[{ id: 'a', name: 'A', tagline: '', price: '1' }]} categories={[{ id: 'c', title: 'C', features: [{ id: 'f', name: 'F', values: { a: true } }] }]} />)
    expect(screen.getByText('1 specification')).toBeInTheDocument()
  })

  it('say a change in French, what is added and what is removed', () => {
    render(
      <ChangeList
        label="Modifications"
        changes={[
          { label: 'Seuil', before: '10', after: '20' },
          { label: 'Clé API', after: 'abc' },
          { label: 'Webhook', before: 'https://exemple.fr' },
        ]}
      />,
      { wrapper: French },
    )
    const [changed, added, removed] = within(screen.getByRole('list', { name: 'Modifications' })).getAllByRole('listitem')
    // A screen reader hears « de 10 à 20 ».
    expect(within(changed).getByText('de')).toHaveClass('sr-only')
    expect(within(changed).getByText('à')).toHaveClass('sr-only')
    expect(within(added).getByText('Ajout')).toBeInTheDocument()
    expect(within(removed).getByText('Suppression')).toBeInTheDocument()
  })

  it('name a table\'s frame that scrolls "Tableau" where it has no name', () => {
    framesScroll()
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Commande</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>2026-0042</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
      { wrapper: French },
    )
    expect(screen.getByRole('region', { name: 'Tableau' })).toBeInTheDocument()
  })

  it('take an application\'s own words', async () => {
    const user = userEvent.setup()
    render(
      <>
        <AdvancedDataTable data={ORDERS} columns={COLUMNS.slice(0, 1)} />
        <SelectionBasket selectedCount={2} onClearSelection={() => {}} />
        <ChangeList changes={[{ label: 'Key', after: 'abc' }]} />
      </>,
      { wrapper: Own },
    )
    expect(screen.getByRole('button', { name: 'Onwards' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Empty the basket' })).toBeInTheDocument()
    expect(screen.getByText('Added')).toBeInTheDocument()
    // The others English's, as they were.
    await user.click(screen.getByRole('button', { name: 'Onwards' }))
    expect(screen.getByText(saying('Showing 11–12 of 12 records'))).toBeInTheDocument()
  })
})

const CITIES = [
  { value: 'lyon', label: 'Lyon' },
  { value: 'paris', label: 'Paris' },
  { value: 'lille', label: 'Lille' },
]

describe('the selects in French', () => {
  it('MultiSelect says its placeholder, its chips, what it makes, its limit and what matches nothing', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<MultiSelect label="Villes" options={CITIES} onCreateOption={(text) => text} max={2} />, { wrapper: French })
    const field = screen.getByRole('combobox', { name: 'Villes' })
    expect(field).toHaveAttribute('placeholder', 'Choisir…')

    await user.type(field, 'Nantes')
    expect(screen.getByRole('option', { name: named('Ajouter « Nantes »') })).toBeInTheDocument()
    unmount()

    render(<MultiSelect label="Villes" options={CITIES} max={1} defaultValue={['lyon']} />, { wrapper: French })
    expect(screen.getByRole('button', { name: 'Retirer Lyon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Villes' }))
    expect(screen.getByText(saying('1 choix au maximum : retirez-le pour en faire un autre.'))).toHaveAttribute('role', 'status')
  })

  it('MultiSelect says nothing matches, and names the chips "+2" stands for as French lists them', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Villes" options={CITIES} maxChips={1} defaultValue={['lyon', 'paris', 'lille']} />, { wrapper: French })
    await user.type(screen.getByRole('combobox', { name: 'Villes' }), 'zzz')
    expect(screen.getByText('Aucun résultat')).toBeInTheDocument()
    await user.hover(screen.getByText('+2'))
    expect(await screen.findByRole('tooltip', { hidden: true })).toHaveTextContent('Paris et Lille')
  })

  it('Combobox and SpringSelect say their placeholders, their search and what it does not find', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Combobox aria-label="Transporteur" options={[{ value: 'poste', label: 'La Poste' }]} />
        <SpringSelect aria-label="Pays" options={[{ value: 'fr', label: 'France' }]} />
      </>,
      { wrapper: French },
    )
    expect(screen.getByRole('combobox', { name: 'Transporteur' })).toHaveTextContent('Sélectionner…')
    expect(screen.getByRole('combobox', { name: 'Pays' })).toHaveTextContent('Sélectionner…')

    await user.click(screen.getByRole('combobox', { name: 'Transporteur' }))
    const search = screen.getByPlaceholderText('Rechercher…')
    await waitFor(() => expect(search).toHaveFocus())
    await user.type(search, 'zzz')
    expect(screen.getByText('Aucun résultat.')).toBeInTheDocument()
  })

  it('take an application\'s own words', () => {
    render(
      <>
        <MultiSelect label="Cities" options={CITIES} />
        <SpringSelect aria-label="Country" options={[{ value: 'fr', label: 'France' }]} />
      </>,
      { wrapper: Own },
    )
    expect(screen.getByRole('combobox', { name: 'Cities' })).toHaveAttribute('placeholder', 'Pick cities')
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Pick one')
  })
})

describe('the fields in French', () => {
  it('InlineEdit names its value, its buttons and its failure', async () => {
    const user = userEvent.setup()
    render(<InlineEdit value="" label="Nom de la course" onSave={() => Promise.reject(new Error('down'))} />, { wrapper: French })

    await user.click(screen.getByRole('button', { name: named('Ajouter une valeur, modifier : Nom de la course') }))
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Nom de la course' }), 'Course 41{Enter}')
    expect(await screen.findByText('Échec de l’enregistrement. Réessayez.')).toBeInTheDocument()
  })

  it('SaveBar says what there is to save and names its buttons; its own words still win', () => {
    const { rerender } = render(<SaveBar open onSave={() => {}} onDiscard={() => {}} />, { wrapper: French })
    const bar = screen.getByRole('region', { name: 'Modifications non enregistrées' })
    expect(within(bar).getByText('Modifications non enregistrées')).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Ignorer' })).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()

    rerender(<SaveBar open onSave={() => {}} saving saveLabel="Publier" />)
    expect(screen.getByText('Enregistrement…')).toBeInTheDocument()
    rerender(<SaveBar open onSave={() => {}} saveLabel="Publier" />)
    expect(screen.getByRole('button', { name: 'Publier' })).toBeInTheDocument()
  })

  it('the password field, the code\'s boxes, the copy buttons, the export and the code are named in French', async () => {
    vi.stubGlobal('isSecureContext', true)
    framesScroll()
    const user = userEvent.setup()
    render(
      <>
        <Input type="password" showPasswordToggle aria-label="Mot de passe" />
        <OTPInput length={4} />
        <CopyChip value="sk-live-1234567890" label="la clé" />
        <CopyButton value="IT-1042" showLabel />
        <ExportButton name="commandes" rows={[{ id: 1 }]} columns={[{ header: 'Id', value: (row: { id: number }) => row.id }]} />
        <CodeBlock code={'{\n  "id": 1\n}'} language="json" />
      </>,
      { wrapper: French },
    )

    await user.click(screen.getByRole('button', { name: 'Afficher le mot de passe' }))
    expect(screen.getByRole('button', { name: 'Masquer le mot de passe' })).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Code à usage unique' })).getByRole('textbox', { name: 'Chiffre 1 sur 4' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copier la clé' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exporter en CSV' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copier le code' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Bloc de code' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Copier' }))
    expect(await screen.findByRole('button', { name: 'Copie effectuée' })).toBeInTheDocument()
  })

  it('take an application\'s own words', () => {
    render(
      <>
        <CopyButton value="IT-1042" />
        <ExportButton name="orders" rows={[]} columns={[]} />
      </>,
      { wrapper: Own },
    )
    expect(screen.getByRole('button', { name: 'Copy it' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download the rows' })).toBeInTheDocument()
  })
})

const day = (bad: Record<number, HealthStatus> = {}) =>
  Array.from({ length: 24 }, (_, hour) => ({ status: bad[hour] ?? ('ok' as HealthStatus), at: `${String(hour).padStart(2, '0')}:00` }))

describe('the states in French', () => {
  it('a health status is a word French says', () => {
    render(
      <>
        {(['ok', 'warning', 'down', 'unknown', 'disabled'] as const).map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </>,
      { wrapper: French },
    )
    for (const word of ['En service', 'Dégradé', 'En panne', 'Inconnu', 'Désactivé']) expect(screen.getByText(word)).toBeInTheDocument()
  })

  it('a stale figure, a failed query, a badge, an alert, a skeleton, a loader and a stepper say their words in French', () => {
    render(
      <>
        <SignedValue value={12.4} kind="money" stale />
        <LiveValue value={42} stale />
        <QueryState isPending={false} error={new Error('Délai dépassé')} hasData>
          <p>Données</p>
        </QueryState>
        <Badge onRemove={() => {}}>Lyon</Badge>
        <Alert dismissible>Une alerte</Alert>
        <SkeletonReveal loading skeleton={<div />}>
          <p>Prêt</p>
        </SkeletonReveal>
        <Loader />
        <Stepper steps={[{ title: 'Compte' }, { title: 'Paiement' }]} current={1} />
      </>,
      { wrapper: French },
    )
    expect(screen.getAllByText('(obsolète)')).toHaveLength(2)
    expect(screen.getByText(saying('Actualisation impossible : affichage des dernières données reçues'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retirer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Chargement' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Chargement…' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Progression' })).toBeInTheDocument()
    expect(screen.getByText('(terminée)')).toBeInTheDocument()
  })

  it('a query that never loaded says so', () => {
    render(<QueryState isPending={false} error={new Error('Délai dépassé')} hasData={false}>{null}</QueryState>, { wrapper: French })
    expect(screen.getByText('Chargement impossible')).toBeInTheDocument()
  })

  it('the uptime strip is said in French, its unit always named, its times between brackets', () => {
    render(<StatusHistory label="API, les dernières 24 heures" slots={day({ 2: 'down', 3: 'down', 9: 'warning' })} />, { wrapper: French })
    expect(
      screen.getByRole('img', {
        name: named('API, les dernières 24 heures : 21 heures de fonctionnement, 2 heures de panne (02:00 et 03:00), 1 heure de fonctionnement dégradé (09:00)'),
      }),
    ).toBeInTheDocument()

    const words = bindMessages(fr, 'fr-FR').status
    expect(summariseStatusHistory(day({ 1: 'down', 2: 'down', 3: 'down', 4: 'down', 5: 'down' }), undefined, words)).toBe(
      '19 heures de fonctionnement, 5 heures de panne (01:00, 02:00, 03:00 et 2 autres)',
    )
    expect(summariseStatusHistory([{ status: 'unknown', at: 'lun.' }], { one: 'jour', other: 'jours' }, words)).toBe('1 jour d’état inconnu (lun.)')
    expect(summariseStatusHistory([], undefined, words)).toBe('Aucun historique pour l’instant')
  })

  it('take an application\'s own words', () => {
    render(
      <>
        <StatusBadge status="down" />
        <StatusHistory label="Queue" slots={[]} />
      </>,
      { wrapper: Own },
    )
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Queue: Nothing recorded' })).toBeInTheDocument()
  })
})

describe('the layouts in French', () => {
  beforeEach(framesScroll)

  it('ResizablePanels names its handles and a panel that scrolls', () => {
    render(
      <ResizablePanels>
        <ResizablePanel defaultSize={40} label="l’éditeur">
          <p>Éditeur</p>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <p>Aperçu</p>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <p>Journal</p>
        </ResizablePanel>
      </ResizablePanels>,
      { wrapper: French },
    )
    expect(screen.getByRole('separator', { name: 'Redimensionner l’éditeur' })).toBeInTheDocument()
    expect(screen.getByRole('separator', { name: 'Redimensionner' })).toBeInTheDocument()
    expect(screen.getAllByRole('region', { name: 'Panneau' })).toHaveLength(2)
  })

  it('ScrollProgressNav, DependencyTrace, InteractiveTimeline, AvatarGroup and ChartLegend say their words', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ScrollProgressNav mode="sticky" sections={[{ id: 'un', label: 'Un' }, { id: 'deux', label: 'Deux' }]} />
        <DependencyTrace
          width={300}
          height={100}
          nodes={[
            { id: 'web', label: 'Web', x: 50, y: 50 },
            { id: 'gw', label: 'Passerelle', x: 100, y: 50 },
            { id: 'db', label: 'Base', x: 150, y: 50, status: 'down', statusLabel: 'En panne' },
            { id: 'cache', label: 'Cache', x: 250, y: 50 },
          ]}
          connections={[
            { from: 'web', to: 'db' },
            { from: 'gw', to: 'db' },
            { from: 'db', to: 'cache' },
          ]}
        />
        <InteractiveTimeline
          label="Version 4.2"
          items={[{ id: 'deploy', title: 'Déploiement', timestamp: '14:13', status: 'in-progress', commitHash: '4f2a9c1e0b' }]}
        />
        <AvatarGroup max={1} people={[{ name: 'Ana Ortiz' }, { name: 'Chloé Martin' }, { name: 'David Petit' }]} />
        <ChartLegend items={[{ label: 'Ventes', color: 'var(--chart-series)' }]} />
      </>,
      { wrapper: French },
    )

    expect(screen.getByRole('navigation', { name: 'Sommaire' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Afficher ou masquer le menu des sections' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retour en haut' })).toBeInTheDocument()

    const graph = screen.getByRole('region', { name: 'Graphe des dépendances' })
    expect(graph).toHaveTextContent('Survolez un nœud ou placez-y le focus pour suivre ce qu’il appelle et ce qui l’appelle')
    expect(graph).toHaveTextContent('3 connexions')
    const base = within(graph).getByRole('button', { name: named('Base : En panne') })
    fireEvent.focus(base)
    expect(spaced(graph.textContent)).toContain('Base : En panne · appelle Cache · Web et Passerelle l’appellent')

    expect(screen.getByRole('button', { name: named('Déploiement : en cours') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copier le hash du commit 4f2a9c1' })).toBeInTheDocument()

    expect(screen.getByRole('group', { name: 'Personnes' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: named('2 autres : Chloé Martin et David Petit') })).toBeInTheDocument()
    await user.hover(screen.getByRole('img', { name: named('2 autres : Chloé Martin et David Petit') }))
    expect(await screen.findByRole('tooltip', { hidden: true })).toHaveTextContent('Chloé Martin et David Petit')

    expect(screen.getByRole('list', { name: 'Légende' })).toBeInTheDocument()
  })

  it('PeekCard\'s own link says "Ouvrir"', async () => {
    const user = userEvent.setup()
    render(
      <PeekCard renderContent={() => <p>Échéance le 30 oct.</p>} href="/factures/42">
        <button type="button">Facture 42</button>
      </PeekCard>,
      { wrapper: French },
    )
    await user.tab()
    expect(await screen.findByText('Échéance le 30 oct.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ouvrir' })).toBeInTheDocument()
  })

  it('a connection alone is counted in the singular in English too', () => {
    render(<DependencyTrace width={300} height={100} nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]} connections={[{ from: 'a', to: 'b' }]} />)
    expect(screen.getByText('1 connection')).toBeInTheDocument()
  })

  it('take an application\'s own words', () => {
    render(
      <>
        <AvatarGroup people={[{ name: 'Ana Ortiz' }]} />
        <ScrollProgressNav mode="inline" sections={[{ id: 'one', label: 'One' }]} />
      </>,
      { wrapper: Own },
    )
    expect(screen.getByRole('group', { name: 'Team' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument()
  })
})
