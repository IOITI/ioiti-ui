// The props of every component the package exports, read from its types, for the gallery's tables
// (gallery/src/props.json, committed: a change of a prop shows in review).
//
//   node scripts/props.mjs           writes gallery/src/props.json
//   node scripts/props.mjs --check   fails when it is not what the types say (npm run lint)
//
// A component is a PascalCase export of `ioiti-ui`, `ioiti-ui/react-router` or `ioiti-ui/code` that can be
// called. Its props are the properties of its first parameter's type, those declared in src/ (its own) one by
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
      if (known) known.required = known.required && !optional
      else byName.set(name, { symbol, required: !optional, count: 0 })
      byName.get(name).count += 1
    }
  }
  const props = []
  let inherited = 0
  for (const { symbol, required, count } of byName.values()) {
    const isOwn = symbol.getDeclarations()?.some(own) ?? false
    if (!isOwn) {
      inherited += 1
      continue
    }
    props.push(describeProp(symbol, required && count === members.length, defaults, location))
  }
  return { props, inherited }
}

function componentOf(name, symbol, entry) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
  if (!(target.flags & ts.SymbolFlags.Value)) return undefined
  const declaration = target.valueDeclaration ?? target.getDeclarations()?.[0]
  if (!declaration) return undefined
  const type = checker.getTypeOfSymbolAtLocation(target, declaration)
  const signature = type.getCallSignatures()[0]
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
    component.inherits = { count: inherited, ...inheritsOf(texts) }
    for (const key of Object.keys(component.inherits)) {
      const value = component.inherits[key]
      if (value === undefined || value === false || (Array.isArray(value) && value.length === 0)) delete component.inherits[key]
    }
  }
  return component
}

function generate() {
  const components = {}
  for (const [entry, file] of ENTRIES) {
    const source = program.getSourceFile(join(root, file))
    const module = checker.getSymbolAtLocation(source)
    for (const symbol of checker.getExportsOfModule(module)) {
      const name = symbol.getName()
      if (!isComponentName(name)) continue
      const component = componentOf(name, symbol, entry)
      if (component) components[name] = component
    }
  }
  const sorted = Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b)))
  return `${JSON.stringify(sorted, null, 1)}\n`
}

const text = generate()
if (process.argv.includes('--check')) {
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
  console.log(`props: gallery/src/props.json holds the props of ${Object.keys(JSON.parse(text)).length} components`)
} else {
  writeFileSync(OUT, text)
  console.log(`props: wrote the props of ${Object.keys(JSON.parse(text)).length} components to gallery/src/props.json`)
}
