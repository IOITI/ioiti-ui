// The package's interface as the type checker reads it: for each entry, every name it exports, sorted, with its kind
// (component, function, const, class, interface, type) and its type as TypeScript prints it (as a declaration file
// would: what is written where it is written, what the checker infers where it is not), a function with its
// signatures, an interface with its members, `@deprecated` noted. Then the names it does not export that those types
// name (a props type's `AvatarSize`): a change of the interface shows there too. src/index.test.ts snapshots the names
// an application imports at run time, and sees no type; this sees them all (test/api/<entry>.api.txt, committed: a
// change of the interface shows in review).
//
//   node scripts/api-report.mjs           writes test/api/<entry>.api.txt (npm run api)
//   node scripts/api-report.mjs --check   fails when one is not what the types say (npm run lint)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'test', 'api')
const SRC = join(root, 'src') + sep

// Each entry of package.json's exports that has types, the project it is compiled with, and the name of its report.
const ENTRIES = [
  { name: 'ioiti-ui', file: 'src/index.ts', project: 'tsconfig.lib.json', report: 'ioiti-ui' },
  { name: 'ioiti-ui/react-router', file: 'src/react-router/index.ts', project: 'tsconfig.lib.json', report: 'react-router' },
  { name: 'ioiti-ui/code', file: 'src/code/index.ts', project: 'tsconfig.lib.json', report: 'code' },
  { name: 'ioiti-ui/locales/en', file: 'src/locales/en.ts', project: 'tsconfig.lib.json', report: 'locales-en' },
  { name: 'ioiti-ui/locales/fr', file: 'src/locales/fr.ts', project: 'tsconfig.lib.json', report: 'locales-fr' },
  { name: 'ioiti-ui/vite', file: 'src/vite/index.ts', project: 'tsconfig.vite.json', report: 'vite' },
]

// What the checker infers is printed whole (no `...`), its object types on lines of their own.
const INFERRED =
  ts.NodeBuilderFlags.NoTruncation |
  ts.NodeBuilderFlags.MultilineObjectLiterals |
  ts.NodeBuilderFlags.UseAliasDefinedOutsideCurrentScope |
  ts.NodeBuilderFlags.IgnoreErrors

const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed })

/**
 * Prints a node as TypeScript does, made to say what an application sees: a parameter destructured where it is
 * written (`({ from, to }: Range) => string`) by its type alone (`({…}: Range) => string`), which its function's body
 * may change without changing the interface; a tuple on one line, as the checker prints one.
 */
function print(node, sourceFile) {
  const plain = (context) => (top) => {
    const visit = (each) => {
      if (ts.isParameter(each) && !ts.isIdentifier(each.name)) {
        const name = context.factory.createIdentifier(ts.isArrayBindingPattern(each.name) ? '[…]' : '{…}')
        const type = each.type && ts.visitNode(each.type, visit)
        return context.factory.updateParameterDeclaration(each, each.modifiers, each.dotDotDotToken, name, each.questionToken ?? (each.initializer ? context.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined), type, undefined)
      }
      const visited = ts.visitEachChild(each, visit, context)
      if (ts.isTupleTypeNode(visited)) ts.setEmitFlags(visited, ts.EmitFlags.SingleLine)
      return visited
    }
    return ts.visitNode(top, visit)
  }
  const result = ts.transform(node, [plain])
  try {
    return tidy(printer.printNode(ts.EmitHint.Unspecified, result.transformed[0], sourceFile))
  } finally {
    result.dispose()
  }
}

/** Names in one order on every machine, whatever its locale: by their letters, then by case. */
function byName(a, b) {
  const lower = a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0
  return lower || (a < b ? -1 : a > b ? 1 : 0)
}

/**
 * TypeScript's text, made the same wherever it was written: lines of two spaces, no `;` at their ends, React's types
 * by their names (`ReactNode`, not `React.ReactNode`), strings in double quotes, no absolute path.
 */
function tidy(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/^( {4})+/, (indent) => '  '.repeat(indent.length / 4)).replace(/;$/, ''))
    .join('\n')
    .replace(/\bReact\./g, '')
    .replace(/'([^'"\\\n]*)'/g, '"$1"')
    .replaceAll(root.split(sep).join('/'), '')
    .replaceAll(root, '')
}

const indented = (text, by = '  ') => text.split('\n').join(`\n${by}`)
const fileOf = (node) => relative(root, node.getSourceFile().fileName).split(sep).join('/')
const own = (declaration) => {
  const file = declaration.getSourceFile().fileName
  return file.startsWith(SRC) || file.startsWith(SRC.split(sep).join('/'))
}
const isComponentName = (name) => /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name)
const isDeprecated = (node) => Boolean(node && ts.getJSDocDeprecatedTag(node))

function programOf(project, files) {
  const config = ts.getParsedCommandLineOfConfigFile(join(root, project), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })
  return ts.createProgram({ rootNames: files.map((file) => join(root, file)), options: { ...config.options, noEmit: true } })
}

function reportsOf(program, entries) {
  const checker = program.getTypeChecker()
  const resolve = (symbol) => (symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol)
  const exportsOf = (entry) => checker.getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(join(root, entry.file))))
  // Which entry exports what (a symbol named there under another name, `DrawCheckbox` as `Checkbox`, too).
  const exporters = new Map()
  for (const entry of entries) {
    for (const exported of exportsOf(entry)) {
      const symbol = resolve(exported)
      if (!exporters.has(symbol)) exporters.set(symbol, new Map())
      exporters.get(symbol).set(entry.name, exported.getName())
    }
  }

  return entries.map((entry) => {
    // The names this entry's types name and it does not export, found as they are printed: listed after its own.
    const named = new Map()

    /** Notes a name of the package's own that a type names, where this entry does not export it (or not by that name). */
    const note = (found) => {
      const symbol = resolve(found)
      const declarations = symbol?.getDeclarations() ?? []
      if (!symbol || symbol.flags & ts.SymbolFlags.TypeParameter || !declarations.length || !declarations.every(own)) return
      if (exporters.get(symbol)?.get(entry.name) === symbol.getName() || named.has(symbol)) return
      named.set(symbol, symbol.getName())
    }

    /** The names a written type names. */
    const collect = (node) => {
      const visit = (each) => {
        if (ts.isTypeReferenceNode(each)) note(checker.getSymbolAtLocation(each.typeName))
        else if (ts.isExpressionWithTypeArguments(each)) note(checker.getSymbolAtLocation(each.expression))
        else if (ts.isTypeQueryNode(each)) note(checker.getSymbolAtLocation(each.exprName))
        ts.forEachChild(each, visit)
      }
      visit(node)
    }

    /** The names an inferred type is printed with: its aliases', its interfaces', through what it is made of. */
    const collectType = (type, seen = new Set()) => {
      if (!type || seen.has(type)) return
      seen.add(type)
      if (type.aliasSymbol) {
        note(type.aliasSymbol)
        for (const argument of type.aliasTypeArguments ?? []) collectType(argument, seen)
        return
      }
      if (type.isUnionOrIntersection()) {
        for (const member of type.types) collectType(member, seen)
        return
      }
      if (!(type.flags & ts.TypeFlags.Object)) return
      const symbol = type.getSymbol()
      if (symbol && symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.Class | ts.SymbolFlags.Enum)) {
        note(symbol)
        if (type.objectFlags & ts.ObjectFlags.Reference) for (const argument of checker.getTypeArguments(type)) collectType(argument, seen)
        return
      }
      for (const property of checker.getPropertiesOfType(type)) collectType(checker.getTypeOfSymbol(property), seen)
      for (const signature of [...type.getCallSignatures(), ...type.getConstructSignatures()]) {
        for (const parameter of signature.getParameters()) collectType(checker.getTypeOfSymbol(parameter), seen)
        collectType(signature.getReturnType(), seen)
      }
    }

    /** A node as written, printed by TypeScript. */
    const written = (node) => {
      collect(node)
      return print(node, node.getSourceFile())
    }

    /** A type the checker infers (no annotation says it), printed by TypeScript. */
    const inferred = (type, enclosing) => {
      collectType(type)
      const node = checker.typeToTypeNode(type, enclosing, INFERRED)
      return node ? print(node, enclosing?.getSourceFile()) : tidy(checker.typeToString(type, enclosing))
    }

    /** A declaration's type: its annotation where it has one, else the checker's. */
    const typeOf = (declaration, symbol) =>
      declaration?.type ? written(declaration.type) : inferred(checker.getTypeOfSymbolAtLocation(symbol, declaration), declaration)

    /** A parameter as an application passes it: its name (`props` for a component's, `{…}` destructured) and type. */
    const parameterText = (parameter, index, component) => {
      const declaration = parameter.valueDeclaration
      if (!declaration || !ts.isParameter(declaration)) return `${parameter.getName()}: ${inferred(checker.getTypeOfSymbol(parameter))}`
      const name = ts.isIdentifier(declaration.name) ? declaration.name.text : component && index === 0 ? 'props' : '{…}'
      const rest = declaration.dotDotDotToken ? '...' : ''
      const optional = !rest && (declaration.questionToken || declaration.initializer) ? '?' : ''
      const type = declaration.type
        ? written(declaration.type)
        : inferred(optional ? checker.getNonNullableType(checker.getTypeOfSymbol(parameter)) : checker.getTypeOfSymbol(parameter), declaration)
      return `${rest}${name}${optional}: ${type}`
    }

    /** A signature: `<T extends X>(a: A, b?: B): R`. */
    const signatureText = (signature, component = false) => {
      const declaration = signature.getDeclaration()
      const typeParameters = declaration?.typeParameters?.length
        ? `<${declaration.typeParameters.map((parameter) => written(parameter)).join(', ')}>`
        : ''
      const parameters = signature.getParameters().map((parameter, index) => parameterText(parameter, index, component))
      const returns = declaration?.type ? written(declaration.type) : inferred(signature.getReturnType(), declaration)
      return `${typeParameters}(${parameters.join(', ')}): ${returns}`
    }

    /** Whether a value's type is a function's written nowhere else (a function, an arrow function): its signatures say it. */
    const isPlainFunction = (type) => {
      if (!type.getCallSignatures().length || type.aliasSymbol) return false
      const symbol = type.getSymbol()
      if (!symbol) return false
      if (symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Method)) return true
      return symbol.getName() === '__function' && checker.getPropertiesOfType(type).length === 0
    }

    /** The type parameters of a declaration, as written: `<S extends string = string>`. */
    const typeParametersOf = (declaration) =>
      declaration?.typeParameters?.length ? `<${declaration.typeParameters.map((parameter) => written(parameter)).join(', ')}>` : ''

    /** An interface's or a type literal's members, as written: one per line, sorted, those deprecated noted. */
    const membersOf = (members) => {
      const lines = members.map((member) => {
        const key = member.name ? member.name.getText().replace(/^['"]|['"]$/g, '') : ''
        const mark = isDeprecated(member) ? '/** @deprecated */ ' : ''
        return { key, text: `${mark}${written(member)}` }
      })
      lines.sort((a, b) => byName(a.key, b.key))
      return lines.map((line) => `  ${indented(line.text)}`)
    }

    /** A class: its heritage, then what an application reaches of it (no private or protected member). */
    const classText = (name, symbol, mark) => {
      const declaration = symbol.getDeclarations().find(ts.isClassDeclaration)
      const heritage = (declaration.heritageClauses ?? []).map((clause) => `${ts.tokenToString(clause.token)} ${clause.types.map(written).join(', ')}`)
      const lines = []
      for (const member of declaration.members) {
        const modifiers = ts.getCombinedModifierFlags(member)
        if (modifiers & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) continue
        if (member.name && ts.isPrivateIdentifier(member.name)) continue
        const prefix = `${isDeprecated(member) ? '/** @deprecated */ ' : ''}${modifiers & ts.ModifierFlags.Static ? 'static ' : ''}${modifiers & ts.ModifierFlags.Readonly ? 'readonly ' : ''}`
        if (ts.isConstructorDeclaration(member)) {
          const signature = checker.getSignatureFromDeclaration(member)
          lines.push({ key: '', text: `constructor(${signature.getParameters().map((parameter, index) => parameterText(parameter, index, false)).join(', ')})` })
        } else if (ts.isMethodDeclaration(member)) {
          const memberName = member.name.getText()
          lines.push({ key: memberName, text: `${prefix}${memberName}${member.questionToken ? '?' : ''}${signatureText(checker.getSignatureFromDeclaration(member))}` })
        } else if (ts.isPropertyDeclaration(member) || ts.isGetAccessorDeclaration(member)) {
          const memberName = member.name.getText()
          const memberSymbol = checker.getSymbolAtLocation(member.name)
          lines.push({ key: memberName, text: `${prefix}${memberName}${member.questionToken ? '?' : ''}: ${typeOf(member, memberSymbol)}` })
        }
      }
      lines.sort((a, b) => byName(a.key, b.key))
      const body = lines.length ? `{\n${lines.map((line) => `  ${indented(line.text)}`).join('\n')}\n}` : '{}'
      return `${mark}class ${name}${typeParametersOf(declaration)}${heritage.length ? ` ${heritage.join(' ')}` : ''} ${body}`
    }

    /** A function, a component, a constant: its signatures where it is a function written nowhere else, else its type. */
    const valueText = (name, symbol, mark) => {
      const declaration = symbol.valueDeclaration ?? symbol.getDeclarations()[0]
      const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
      const callable = type.getCallSignatures().length > 0
      const component = callable && isComponentName(name)
      const kind = component ? 'component' : callable ? 'function' : 'const'
      const annotated = ts.isVariableDeclaration(declaration) && declaration.type
      if (!annotated && isPlainFunction(type)) {
        return type
          .getCallSignatures()
          .map((signature) => `${mark}${kind} ${name}${signatureText(signature, component)}`)
          .join('\n')
      }
      return `${mark}${kind} ${name}: ${annotated ? written(declaration.type) : inferred(type, declaration)}`
    }

    /** Every block a name stands for: its value, and its type where it is a type too. */
    const blocksOf = (name, symbol) => {
      const declarations = symbol.getDeclarations() ?? []
      const mark = declarations.some(isDeprecated) || symbol.getJsDocTags(checker).some((tag) => tag.name === 'deprecated') ? '/** @deprecated */ ' : ''
      const texts = []
      if (symbol.flags & ts.SymbolFlags.Class) texts.push(classText(name, symbol, mark))
      else if (symbol.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable)) texts.push(valueText(name, symbol, mark))
      else if (symbol.flags & ts.SymbolFlags.Enum) texts.push(`${mark}enum ${name} { ${declarations.flatMap((declaration) => declaration.members?.map((member) => member.name.getText()) ?? []).join(', ')} }`)
      if (symbol.flags & ts.SymbolFlags.Interface) {
        const interfaces = declarations.filter(ts.isInterfaceDeclaration)
        const bases = interfaces.flatMap((declaration) => (declaration.heritageClauses ?? []).flatMap((clause) => clause.types.map(written)))
        const members = membersOf(interfaces.flatMap((declaration) => [...declaration.members]))
        const body = members.length ? `{\n${members.join('\n')}\n}` : '{}'
        texts.push(`${mark}interface ${name}${typeParametersOf(interfaces[0])}${bases.length ? ` extends ${bases.join(', ')}` : ''} ${body}`)
      } else if (symbol.flags & ts.SymbolFlags.TypeAlias) {
        const declaration = declarations.find(ts.isTypeAliasDeclaration)
        texts.push(`${mark}type ${name}${typeParametersOf(declaration)} = ${written(declaration.type)}`)
      }
      return texts
    }

    const blocks = []
    for (const exported of exportsOf(entry)) {
      const name = exported.getName()
      for (const text of blocksOf(name, resolve(exported))) blocks.push({ name, text })
    }
    blocks.sort((a, b) => byName(a.name, b.name))

    // The names its types name that it does not export: each with where it is declared, or the entry that exports it.
    const others = []
    const done = new Set()
    for (let fresh = [...named.keys()]; fresh.length; fresh = [...named.keys()].filter((symbol) => !done.has(symbol))) {
      for (const symbol of fresh) {
        done.add(symbol)
        const name = named.get(symbol)
        const by = exporters.get(symbol) ?? new Map()
        if (by.has(entry.name)) {
          others.push({ name, text: `${name}: exported as ${by.get(entry.name)}` })
          continue
        }
        if (by.size) {
          const [other, as] = [...by][0]
          others.push({ name, text: `${name}: exported by ${other}${as === name ? '' : ` as ${as}`}` })
          continue
        }
        const where = fileOf(symbol.getDeclarations()[0])
        for (const text of blocksOf(name, symbol)) others.push({ name, text: `// ${where}\n${text}` })
      }
    }
    others.sort((a, b) => byName(a.name, b.name) || byName(a.text, b.text))

    const lines = [
      `${entry.name} (${entry.file}): what it exports, and its types, as the type checker reads them.`,
      'Made by npm run api (scripts/api-report.mjs); npm run lint holds it.',
      '',
      blocks.map((block) => block.text).join('\n\n'),
    ]
    if (others.length) {
      lines.push('', '', `// The names the types above use that ${entry.name} does not export, or not by that name.`, '', others.map((block) => block.text).join('\n\n'))
    }
    return { entry, text: `${lines.join('\n')}\n` }
  })
}

const reports = []
for (const project of [...new Set(ENTRIES.map((entry) => entry.project))]) {
  const entries = ENTRIES.filter((entry) => entry.project === project)
  reports.push(...reportsOf(programOf(project, entries.map((entry) => entry.file)), entries))
}

const fileName = (entry) => `${entry.report}.api.txt`

if (process.argv.includes('--check')) {
  let failed = false
  for (const { entry, text } of reports) {
    let current = ''
    try {
      current = readFileSync(join(OUT, fileName(entry)), 'utf8')
    } catch {
      // None yet.
    }
    if (current === text) continue
    failed = true
    // What changed: the lines between the first and the last that differ, the first few of each side.
    const was = current.split('\n')
    const now = text.split('\n')
    let start = 0
    while (start < was.length && start < now.length && was[start] === now[start]) start += 1
    let wasEnd = was.length
    let nowEnd = now.length
    while (wasEnd > start && nowEnd > start && was[wasEnd - 1] === now[nowEnd - 1]) {
      wasEnd -= 1
      nowEnd -= 1
    }
    console.error(`api: test/api/${fileName(entry)} is not what the types say, from its line ${start + 1}:`)
    for (const [sign, lines] of [['-', was.slice(start, wasEnd)], ['+', now.slice(start, nowEnd)]]) {
      for (const each of lines.slice(0, 8)) console.error(`  ${sign} ${each}`)
      if (lines.length > 8) console.error(`  ${sign} … and ${lines.length - 8} lines more`)
    }
  }
  if (failed) {
    console.error('api: npm run api, if it is meant (and a line of CHANGELOG.md: the interface changed)')
    process.exit(1)
  }
  console.log(`api: test/api holds the interface of the ${reports.length} entries`)
} else {
  mkdirSync(OUT, { recursive: true })
  for (const { entry, text } of reports) writeFileSync(join(OUT, fileName(entry)), text)
  console.log(`api: wrote the interface of the ${reports.length} entries to test/api`)
}
