// The props of every component the package exports, read from its types, for the gallery's tables
// (gallery/src/props.json, committed: a change of a prop shows in review).
//
//   node scripts/props.mjs                   writes gallery/src/props.json
//   node scripts/props.mjs --check           fails when it is not what the types say (npm run lint); when a component's
//                                            props type (`ButtonProps`) is not exported by the entry that exports it;
//                                            when a component or a prop has no JSDoc and is not in scripts/docs-baseline.json,
//                                            or one of its entries has its JSDoc now, or is no longer there
//   node scripts/props.mjs --docs-baseline   writes scripts/docs-baseline.json: the components and props without JSDoc
//                                            that it lists still (`Button`, `Button.variant`). The list only shrinks: it
//                                            takes none in, but where there is no list yet
//
// A component is a PascalCase export of `ioiti-ui`, `ioiti-ui/react-router` or `ioiti-ui/code` that can be
// called, or a class constructed with its props. Its props are the properties of its first parameter's type, those declared in src/ (its own) one by
// one: the type as written (an alias such as `ButtonVariant` kept), the values of a union of literals, whether
// it is required, its JSDoc, and its default (a `@default` tag, else the default of its destructuring). Those it
// takes from elsewhere (React's attributes of an element, framer-motion's) are counted, and said by the element
// they are of.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'gallery', 'src', 'props.json')
const ENTRIES = [
  ['ioiti-ui', 'src/index.ts'],
  ['ioiti-ui/react-router', 'src/react-router/index.ts'],
  ['ioiti-ui/code', 'src/code/index.ts'],
]
const SRC = join(root, 'src') + sep

const config = ts.getParsedCommandLineOfConfigFile(join(root, 'tsconfig.lib.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })
const program = ts.createProgram({
  rootNames: ENTRIES.map(([, file]) => join(root, file)),
  options: { ...config.options, noEmit: true },
})
const checker = program.getTypeChecker()

const isComponentName = (name) => /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name)
const own = (declaration) => {
  const file = declaration.getSourceFile().fileName
  return file.startsWith(SRC) || file.startsWith(SRC.split(sep).join('/'))
}
const oneLine = (text) => text.replace(/\s+/g, ' ').replace(/\bReact\./g, '').trim()

/** The function that draws a component, from its declaration: through forwardRef, memo, a typed const. */
function functionOf(node, seen = new Set()) {
  if (!node || seen.has(node)) return undefined
  seen.add(node)
  if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return node
  if (ts.isVariableDeclaration(node)) return functionOf(node.initializer, seen)
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) return functionOf(node.expression, seen)
  if (ts.isCallExpression(node)) {
    for (const argument of node.arguments) {
      const found = functionOf(argument, seen)
      if (found) return found
    }
    return undefined
  }
  if (ts.isIdentifier(node)) {
    const symbol = checker.getSymbolAtLocation(node)
    return symbol?.valueDeclaration && functionOf(symbol.valueDeclaration, seen)
  }
  return undefined
}

/** The defaults a component gives its props: those of its parameter's destructuring, or of `const {…} = props`. */
function defaultsOf(fn) {
  const defaults = new Map()
  if (!fn) return defaults
  const take = (pattern) => {
    for (const element of pattern.elements) {
      if (element.dotDotDotToken || !element.initializer) continue
      const name = (element.propertyName ?? element.name).getText()
      defaults.set(name, oneLine(element.initializer.getText()))
    }
  }
  const parameter = fn.parameters[0]
  if (!parameter) return defaults
  if (ts.isObjectBindingPattern(parameter.name)) take(parameter.name)
  else if (ts.isIdentifier(parameter.name) && fn.body && ts.isBlock(fn.body)) {
    const props = parameter.name.text
    for (const statement of fn.body.statements) {
      if (!ts.isVariableStatement(statement)) continue
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isObjectBindingPattern(declaration.name) && declaration.initializer?.getText() === props) take(declaration.name)
      }
    }
  }
  return defaults
}

/** The texts a props type is made of, to find the element whose attributes it takes. */
function typeTexts(type, depth = 0, seen = new Set()) {
  const texts = []
  if (!type || depth > 4) return texts
  const symbol = type.aliasSymbol ?? type.getSymbol()
  for (const declaration of symbol?.getDeclarations() ?? []) {
    if (seen.has(declaration) || !own(declaration)) continue
    seen.add(declaration)
    if (ts.isInterfaceDeclaration(declaration)) {
      for (const clause of declaration.heritageClauses ?? []) {
        for (const base of clause.types) {
          texts.push(base.getText())
          texts.push(...typeTexts(checker.getTypeAtLocation(base), depth + 1, seen))
        }
      }
    } else if (ts.isTypeAliasDeclaration(declaration)) {
      texts.push(declaration.type.getText())
    }
  }
  if (type.isUnionOrIntersection()) for (const member of type.types) texts.push(...typeTexts(member, depth + 1, seen))
  return texts
}

/**
 * The texts an own alias or interface named in a type node is written with, through the names it is given
 * (`TableRowProps` is `ComponentProps<'tr'>`, `FormControlProps` an `HTMLAttributes<HTMLDivElement>`): the element whose
 * attributes a component takes is found under its props' name too.
 */
function writtenTexts(node, depth = 0) {
  const texts = []
  if (!node || depth > 4) return texts
  const visit = (each) => {
    if (ts.isTypeReferenceNode(each)) {
      const symbol = checker.getSymbolAtLocation(each.typeName)
      const target = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      for (const declaration of target?.getDeclarations() ?? []) {
        if (!own(declaration)) continue
        if (ts.isTypeAliasDeclaration(declaration)) texts.push(declaration.type.getText(), ...writtenTexts(declaration.type, depth + 1))
        else if (ts.isInterfaceDeclaration(declaration)) {
          for (const clause of declaration.heritageClauses ?? []) for (const base of clause.types) texts.push(base.getText())
        }
      }
    }
    ts.forEachChild(each, visit)
  }
  visit(node)
  return texts
}

const ELEMENTS = {
  HTMLAnchorElement: 'a',
  HTMLButtonElement: 'button',
  HTMLDivElement: 'div',
  HTMLFormElement: 'form',
  HTMLHeadingElement: 'h2',
  HTMLInputElement: 'input',
  HTMLLabelElement: 'label',
  HTMLLIElement: 'li',
  HTMLOListElement: 'ol',
  HTMLParagraphElement: 'p',
  HTMLSelectElement: 'select',
  HTMLSpanElement: 'span',
  HTMLTableCellElement: 'td',
  HTMLTableElement: 'table',
  HTMLTableRowElement: 'tr',
  HTMLTableSectionElement: 'tbody',
  HTMLTextAreaElement: 'textarea',
  HTMLUListElement: 'ul',
  HTMLElement: 'element',
}

/** Where the props a component takes from elsewhere come from: an element's attributes, framer-motion's, a component's. */
function inheritsOf(texts) {
  const all = texts.filter(Boolean).join(' ')
  const motion = /\bHTMLMotionProps\b|\bMotionProps\b/.test(all)
  let element
  const tag = all.match(/(?:ComponentProps(?:WithoutRef|WithRef)?|HTMLMotionProps|ComponentPropsWithoutRef)<\s*['"](\w+)['"]\s*>/)
  if (tag) element = tag[1]
  if (!element) {
    const named = all.match(/\b(HTML\w*Element)\b/)
    if (named) element = ELEMENTS[named[1]] ?? 'element'
  }
  let component
  const of = all.match(/ComponentProps(?:WithoutRef)?<\s*typeof\s+(\w+)\s*>/)
  if (of) component = of[1]
  const omit = []
  for (const [, keys] of all.matchAll(/Omit<[^,]+(?:<[^>]*>)?[^,]*,\s*([^>]+)>/g)) {
    for (const [, key] of keys.matchAll(/['"]([^'"]+)['"]/g)) if (!omit.includes(key)) omit.push(key)
  }
  return { element, component, motion, omit }
}

/** The values of a union of literals in the order the source writes them (`'xs' | 'sm' | 'md'`), through an alias. */
function writtenValues(node, depth = 0) {
  if (!node || depth > 3) return undefined
  if (ts.isParenthesizedTypeNode(node)) return writtenValues(node.type, depth + 1)
  if (ts.isLiteralTypeNode(node)) {
    const literal = node.literal
    if (ts.isStringLiteral(literal) || ts.isNumericLiteral(literal)) return [literal.text]
    return undefined
  }
  if (ts.isUnionTypeNode(node)) {
    const values = []
    for (const member of node.types) {
      if (member.kind === ts.SyntaxKind.UndefinedKeyword || member.kind === ts.SyntaxKind.NullKeyword) continue
      const found = writtenValues(member, depth + 1)
      if (!found) return undefined
      values.push(...found)
    }
    return values
  }
  if (ts.isTypeReferenceNode(node)) {
    const symbol = checker.getSymbolAtLocation(node.typeName)
    const target = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    const alias = target?.getDeclarations()?.find(ts.isTypeAliasDeclaration)
    return alias ? writtenValues(alias.type, depth + 1) : undefined
  }
  return undefined
}

function literalValues(type) {
  const kept = checker.getNonNullableType(type)
  if (kept.isStringLiteral() || kept.isNumberLiteral()) return [String(kept.value)]
  if (!kept.isUnion()) return undefined
  const values = []
  for (const member of kept.types) {
    if (member.isStringLiteral() || member.isNumberLiteral()) values.push(String(member.value))
    else if (member.flags & ts.TypeFlags.BooleanLiteral) return undefined
    else return undefined
  }
  return values.length ? values : undefined
}

function describeProp(symbol, required, defaults, location) {
  const declaration = symbol.getDeclarations()?.find(own) ?? symbol.getDeclarations()?.[0]
  const type = checker.getTypeOfSymbolAtLocation(symbol, location)
  let typeText
  if (declaration && (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) && declaration.type) typeText = declaration.type.getText()
  else typeText = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
  const tags = symbol.getJsDocTags(checker)
  const tagged = tags.find((tag) => tag.name === 'default' || tag.name === 'defaultValue')
  const description = ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replace(/^ioiti-ui:\s*/i, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim()
    .replace(/^[a-z]/, (letter) => letter.toUpperCase())
  const prop = { name: symbol.getName(), type: oneLine(typeText) }
  const typeNode = declaration && (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) ? declaration.type : undefined
  const resolved = literalValues(type)
  const written = resolved && writtenValues(typeNode)
  const values = written && written.length === resolved.length ? written : resolved
  if (values && values.length > 1) prop.values = values
  if (required) prop.required = true
  const fallback = tagged ? oneLine(ts.displayPartsToString(tagged.text)) : defaults.get(symbol.getName())
  if (fallback !== undefined) prop.default = fallback
  if (description) prop.description = description
  // A deprecated prop says what replaces it (its tag's words): the props tables mark it.
  const deprecation = tags.find((tag) => tag.name === 'deprecated')
  if (deprecation) prop.deprecated = oneLine(ts.displayPartsToString(deprecation.text)) || 'Deprecated.'
  return prop
}

/** The props of a component's props type: its own, described, and a count of the others. */
function propsOf(type, defaults, location) {
  const members = type.isUnion() ? type.types : [type]
  const byName = new Map()
  for (const member of members) {
    for (const symbol of checker.getPropertiesOfType(member)) {
      const name = symbol.getName()
      const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0
      const known = byName.get(name)
      if (known) {
        known.required = known.required && !optional
        known.others.push(symbol)
      } else byName.set(name, { symbol, others: [], required: !optional, count: 0 })
      byName.get(name).count += 1
    }
  }
  const props = []
  let inherited = 0
  for (const { symbol, others, required, count } of byName.values()) {
    const isOwn = symbol.getDeclarations()?.some(own) ?? false
    if (!isOwn) {
      inherited += 1
      continue
    }
    const prop = describeProp(symbol, required && count === members.length, defaults, location)
    // A prop of each member of a union of props (`mode: 'single'` or `mode: 'range'`): its types, each once.
    if (others.length) {
      const all = [prop, ...others.map((other) => describeProp(other, false, defaults, location))]
      const literal = (each) => each.values ?? (/^(['"])[^'"]*\1$/.test(each.type) ? [each.type.slice(1, -1)] : undefined)
      const values = all.map(literal)
      if (values.every(Boolean)) prop.values = [...new Set(values.flat())]
      const types = [...new Set(all.map((each) => each.type))]
      prop.type = types.map((type) => (types.length > 1 && type.includes('=>') ? `(${type})` : type)).join(' | ')
      prop.description ??= all.find((each) => each.description)?.description
    }
    props.push(prop)
  }
  return { props, inherited }
}

function componentOf(name, symbol, entry) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
  if (!(target.flags & ts.SymbolFlags.Value)) return undefined
  const declaration = target.valueDeclaration ?? target.getDeclarations()?.[0]
  if (!declaration) return undefined
  // A former name (`renamed(Dialog, 'SettleModal')`, src/lib/renamed.ts) is its component of today: one entry, today's.
  const initializer = ts.isVariableDeclaration(declaration) ? declaration.initializer : undefined
  if (initializer && ts.isCallExpression(initializer) && initializer.expression.getText() === 'renamed') return undefined
  const type = checker.getTypeOfSymbolAtLocation(target, declaration)
  // A function component is called with its props; a class component (ErrorBoundary) constructed with them.
  const signature = type.getCallSignatures()[0] ?? (ts.isClassDeclaration(declaration) ? type.getConstructSignatures()[0] : undefined)
  if (!signature) return undefined
  const fn = functionOf(declaration)
  const parameter = signature.getParameters()[0]
  const component = { entry, file: relative(root, declaration.getSourceFile().fileName).split(sep).join('/'), props: [] }
  if (!parameter) return component
  const propsType = checker.getTypeOfSymbolAtLocation(parameter, declaration)
  const { props, inherited } = propsOf(propsType, defaultsOf(fn), declaration)
  component.props = props
  if (inherited) {
    // The types the props are written with: the parameter's, a typed const's (`React.FC<Props>`), forwardRef's
    // props (its last type argument; the first is its ref's element) or memo's.
    const nodes = []
    if (fn?.parameters[0]?.type) nodes.push(fn.parameters[0].type)
    if (ts.isVariableDeclaration(declaration)) {
      if (declaration.type && ts.isTypeReferenceNode(declaration.type)) nodes.push(...(declaration.type.typeArguments ?? []))
      const call = declaration.initializer && ts.isCallExpression(declaration.initializer) ? declaration.initializer : undefined
      if (call?.typeArguments?.length) nodes.push(call.typeArguments[call.typeArguments.length - 1])
    }
    const texts = nodes.flatMap((node) => [node.getText(), ...typeTexts(checker.getTypeAtLocation(node))])
    texts.push(...typeTexts(propsType))
    // Last, so that what was found before stays first: the texts of the props' own names (`TableRowProps`).
    texts.push(...nodes.flatMap((node) => writtenTexts(node)))
    component.inherits = { count: inherited, ...inheritsOf(texts) }
    for (const key of Object.keys(component.inherits)) {
      const value = component.inherits[key]
      if (value === undefined || value === false || (Array.isArray(value) && value.length === 0)) delete component.inherits[key]
    }
  }
  return component
}

/** Whether a symbol has its JSDoc: words, or a `@deprecated` tag saying what replaces it. */
function documented(symbol) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
  if (ts.displayPartsToString(target.getDocumentationComment(checker)).trim()) return true
  return target.getJsDocTags(checker).some((tag) => tag.name === 'deprecated')
}

function generate() {
  const components = {}
  // The names each entry exports, for the props types; whether each component has its JSDoc, for the ratchet.
  const exported = new Map()
  const componentDocs = new Map()
  for (const [entry, file] of ENTRIES) {
    const source = program.getSourceFile(join(root, file))
    const module = checker.getSymbolAtLocation(source)
    const symbols = checker.getExportsOfModule(module)
    exported.set(entry, new Map(symbols.map((symbol) => [symbol.getName(), symbol])))
    for (const symbol of symbols) {
      const name = symbol.getName()
      if (!isComponentName(name)) continue
      const component = componentOf(name, symbol, entry)
      if (!component) continue
      components[name] = component
      componentDocs.set(name, documented(symbol))
    }
  }
  const sorted = Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b)))
  return { text: `${JSON.stringify(sorted, null, 1)}\n`, components: sorted, exported, componentDocs }
}

const { text, components, exported, componentDocs } = generate()

// The names the conventions retired (docs/conventions.md), and those src/lib/deprecations.ts lists for a component: a
// prop so named is marked @deprecated, or the check fails. A new component cannot bring an old name back.
const RETIRED = ['onValueChange', 'isLoading', 'ariaLabel', 'hideCloseButton', 'showClose', 'isOpen', 'activeTab', 'defaultTab', 'busy', 'saving']
async function unmarked(components) {
  const source = readFileSync(join(root, 'src/lib/deprecations.ts'), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
  const { DEPRECATIONS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
  // A component the list names by its former name (0.31.0's names of roles) is looked for under today's too.
  const today = new Map(Object.values(DEPRECATIONS).filter((entry) => entry.kind === 'export').map((entry) => [entry.old, entry.new]))
  const listed = new Map()
  for (const entry of Object.values(DEPRECATIONS)) {
    if (entry.kind !== 'prop') continue
    for (const component of entry.components) {
      listed.set(`${component}.${entry.old}`, entry.new)
      if (today.has(component)) listed.set(`${today.get(component)}.${entry.old}`, entry.new)
    }
  }
  const problems = []
  for (const [component, { props = [] }] of Object.entries(components)) {
    for (const prop of props) {
      const named = listed.has(`${component}.${prop.name}`) || RETIRED.includes(prop.name)
      if (named && !prop.deprecated) problems.push(`${component}'s ${prop.name}: a name the conventions retired, not marked @deprecated (docs/conventions.md)`)
    }
  }
  return problems
}

// Every component's props type is exported beside it, by its entry, under its name and `Props` (`ButtonProps`): an
// application that wraps a component, or keeps its props, names them. A former name (`SettleModal`) is no component
// of its own here: its new name's type is enough.
function unexported() {
  const problems = []
  for (const [name, { entry }] of Object.entries(components)) {
    const symbol = exported.get(entry).get(`${name}Props`)
    const target = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    if (target && target.flags & ts.SymbolFlags.Type) continue
    const file = ENTRIES.find(([each]) => each === entry)[1]
    problems.push(`${name}'s props are not exported: export the type ${name}Props from ${file}, beside ${name}`)
  }
  return problems
}

// The JSDoc ratchet: a component or a prop without JSDoc is one of the baseline's (scripts/docs-baseline.json), written
// once when it was made; a new one is documented, and the list only shrinks. A prop's JSDoc is its description, or its
// `@deprecated` tag (what replaces it); a component's, the comment above it.
const BASELINE = join(root, 'scripts', 'docs-baseline.json')
const BASELINE_NAME = relative(root, BASELINE).split(sep).join('/')

/** Names in one order on every machine, whatever its locale: by their letters, then by case. */
function byName(a, b) {
  const lower = a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0
  return lower || (a < b ? -1 : a > b ? 1 : 0)
}

/** The components and props without JSDoc today, sorted: `Button`, `Button.variant`. */
function undocumentedNow() {
  const names = []
  for (const [name, { props = [] }] of Object.entries(components)) {
    if (!componentDocs.get(name)) names.push(name)
    for (const prop of props) if (!prop.description && !prop.deprecated) names.push(`${name}.${prop.name}`)
  }
  return names.sort(byName)
}

/** Every component and prop there is today, documented or not: an entry of the list that is none of them is gone. */
function existingNow() {
  const names = new Set()
  for (const [name, { props = [] }] of Object.entries(components)) {
    names.add(name)
    for (const prop of props) names.add(`${name}.${prop.name}`)
  }
  return names
}

function readBaseline() {
  try {
    return JSON.parse(readFileSync(BASELINE, 'utf8'))
  } catch {
    return undefined
  }
}

function undocumented() {
  const baseline = readBaseline()
  if (!baseline) return [`${BASELINE_NAME} is missing: node scripts/props.mjs --docs-baseline`]
  const listed = new Set(baseline)
  const now = undocumentedNow()
  const stillUndocumented = new Set(now)
  const existing = existingNow()
  const problems = []
  for (const name of now) {
    if (!listed.has(name)) problems.push(`${name} has no JSDoc: document it: a line of JSDoc (${BASELINE_NAME} only shrinks)`)
  }
  for (const name of baseline) {
    if (!existing.has(name)) problems.push(`${name}, in ${BASELINE_NAME}, is no longer there: take it off: node scripts/props.mjs --docs-baseline`)
    else if (!stillUndocumented.has(name)) problems.push(`${name} has its JSDoc now: take it off ${BASELINE_NAME}: node scripts/props.mjs --docs-baseline`)
  }
  return problems
}

if (process.argv.includes('--docs-baseline')) {
  const baseline = readBaseline()
  const now = undocumentedNow()
  // The list only shrinks: what it does not list yet is documented, not taken in (but where there is no list yet).
  const kept = baseline ? now.filter((name) => baseline.includes(name)) : now
  const refused = now.filter((name) => !kept.includes(name))
  writeFileSync(BASELINE, `${JSON.stringify(kept, null, 2)}\n`)
  const count = kept.filter((name) => !name.includes('.')).length
  console.log(`props: ${BASELINE_NAME} lists ${count} components and ${kept.length - count} props without JSDoc`)
  for (const name of refused) console.error(`props: ${name} has no JSDoc and is not taken in (the list only shrinks): document it: a line of JSDoc`)
  if (refused.length) process.exit(1)
} else if (process.argv.includes('--check')) {
  const problems = [...(await unmarked(JSON.parse(text))), ...unexported(), ...undocumented()]
  for (const problem of problems) console.error(`props: ${problem}`)
  if (problems.length) process.exit(1)
  let current = ''
  try {
    current = readFileSync(OUT, 'utf8')
  } catch {
    // None yet.
  }
  if (current !== text) {
    console.error('props: gallery/src/props.json is not what the types say: npm run props')
    process.exit(1)
  }
  console.log(`props: gallery/src/props.json holds the props of ${Object.keys(components).length} components, each with its props type exported`)
} else {
  writeFileSync(OUT, text)
  console.log(`props: wrote the props of ${Object.keys(components).length} components to gallery/src/props.json`)
}
