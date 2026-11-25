/** The package's entries a file imports names from. */
const PACKAGE = /^ioiti-ui(?:\/(?:react-router|code))?$/;
const scriptKind = (ts, fileName) => /\.tsx$/.test(fileName)
    ? ts.ScriptKind.TSX
    : /\.jsx$/.test(fileName)
        ? ts.ScriptKind.JSX
        : /\.[cm]?js$/.test(fileName)
            ? ts.ScriptKind.JS
            : ts.ScriptKind.TS;
const listed = (words) => words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
/** The file `fileName`, whose text is `source`, rewritten by `rules` (rulesOf()), read with `ts`, the application's TypeScript. */
export function rewrite(ts, fileName, source, rules) {
    const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, scriptKind(ts, fileName));
    const edits = [];
    const changes = [];
    const notes = [];
    const lineOf = (node) => file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
    const edit = (start, end, text) => edits.push({ start, end, text });
    const replace = (node, text) => edit(node.getStart(file), node.end, text);
    const told = (node, text) => changes.push({ line: lineOf(node), text });
    const note = (node, text) => notes.push({ line: lineOf(node), text });
    /** A word written again with the quote the file wrote it with. */
    const quoted = (node, word) => {
        const quote = source[node.getStart(file)];
        return quote === "'" || quote === '`' ? `${quote}${word}${quote}` : `"${word}"`;
    };
    const renames = new Map(rules.exports.map((rename) => [rename.from, rename]));
    const byHand = new Map(rules.byHand.map((entry) => [entry.name, entry]));
    // The names the file binds itself, or imports from elsewhere: a name of today already one of them (a `Dialog` of
    // another library) is imported under the file's former name instead, its uses left as they are.
    const taken = new Set();
    for (const statement of file.statements) {
        if (ts.isImportDeclaration(statement)) {
            const from = ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : '';
            if (PACKAGE.test(from))
                continue;
            const clause = statement.importClause;
            if (clause?.name)
                taken.add(clause.name.text);
            const bindings = clause?.namedBindings;
            if (bindings && ts.isNamespaceImport(bindings))
                taken.add(bindings.name.text);
            if (bindings && ts.isNamedImports(bindings))
                for (const element of bindings.elements)
                    taken.add(element.name.text);
        }
        else if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations)
                if (ts.isIdentifier(declaration.name))
                    taken.add(declaration.name.text);
        }
        else if ((ts.isFunctionDeclaration(statement) ||
            ts.isClassDeclaration(statement) ||
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement) ||
            ts.isEnumDeclaration(statement)) &&
            statement.name) {
            taken.add(statement.name.text);
        }
    }
    // 1. The names the file imports from the package: the name each stands for today, and those written again.
    const imported = new Map();
    const renamedLocals = new Map();
    const namespaces = new Set();
    let importsPackage = false;
    for (const statement of file.statements) {
        const from = (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) &&
            statement.moduleSpecifier &&
            ts.isStringLiteral(statement.moduleSpecifier)
            ? statement.moduleSpecifier.text
            : undefined;
        if (!from || !PACKAGE.test(from))
            continue;
        importsPackage = true;
        if (ts.isImportDeclaration(statement)) {
            const bindings = statement.importClause?.namedBindings;
            if (bindings && ts.isNamespaceImport(bindings))
                namespaces.add(bindings.name.text);
            if (!bindings || !ts.isNamedImports(bindings))
                continue;
            const names = new Set(bindings.elements.map((element) => (element.propertyName ?? element.name).text));
            bindings.elements.forEach((element, index) => {
                const name = (element.propertyName ?? element.name).text;
                const local = element.name.text;
                const hand = byHand.get(name);
                if (hand)
                    note(element, `${name} is deprecated, with no name in its place: ${hand.instead}`);
                const rename = renames.get(name);
                imported.set(local, rename?.to ?? name);
                if (!rename)
                    return;
                if (element.propertyName) {
                    // `Old as Local`: the name imported changes, the file's own stays.
                    replace(element.propertyName, rename.to);
                }
                else if (taken.has(rename.to)) {
                    // Today's name is the file's for something else: imported under the former one, which the file goes on using.
                    replace(element.name, `${rename.to} as ${local}`);
                    note(element, `${rename.to} names something else in this file: imported as ${local}, to rename by hand if you like`);
                }
                else if (names.has(rename.to)) {
                    // The new name is imported too: the old one goes, and its uses take the new.
                    const elements = bindings.elements;
                    const next = elements[index + 1];
                    if (next)
                        edit(element.getStart(file), next.getStart(file), '');
                    else
                        edit(elements[index - 1].end, element.end, '');
                    renamedLocals.set(local, rename.to);
                }
                else {
                    replace(element.name, rename.to);
                    renamedLocals.set(local, rename.to);
                }
                told(element, `${name} → ${rename.to}`);
            });
        }
        else if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
            // Names the file exports from the package: its own exports keep their names, given by today's.
            for (const element of statement.exportClause.elements) {
                const name = (element.propertyName ?? element.name).text;
                const hand = byHand.get(name);
                if (hand)
                    note(element, `${name} is deprecated, with no name in its place: ${hand.instead}`);
                const rename = renames.get(name);
                if (!rename)
                    continue;
                if (element.propertyName)
                    replace(element.propertyName, rename.to);
                else
                    replace(element.name, `${rename.to} as ${name}`);
                told(element, `${name} → ${rename.to} (exported as ${element.name.text})`);
            }
        }
    }
    if (!importsPackage)
        return { output: source, changes, notes };
    // 2. Every use of a name written again (a tag, a type, a value), and of a renamed name through a namespace.
    const isUse = (node) => {
        const parent = node.parent;
        if (ts.isImportSpecifier(parent) || ts.isImportClause(parent) || ts.isNamespaceImport(parent))
            return false;
        if (ts.isExportSpecifier(parent))
            return !parent.parent.parent.moduleSpecifier && (parent.propertyName ? parent.propertyName === node : true);
        if (ts.isPropertyAccessExpression(parent) || ts.isQualifiedName(parent))
            return (ts.isPropertyAccessExpression(parent) ? parent.expression : parent.left) === node;
        if (ts.isBindingElement(parent))
            return false;
        if (ts.isJsxAttribute(parent) || ts.isLabeledStatement(parent) || ts.isBreakOrContinueStatement(parent))
            return false;
        if (ts.isPropertyAssignment(parent) || ts.isPropertySignature(parent) || ts.isPropertyDeclaration(parent))
            return parent.name !== node;
        if (ts.isMethodDeclaration(parent) || ts.isMethodSignature(parent) || ts.isGetAccessor(parent) || ts.isSetAccessor(parent))
            return parent.name !== node;
        if (ts.isEnumMember(parent))
            return parent.name !== node;
        if ((ts.isVariableDeclaration(parent) ||
            ts.isFunctionDeclaration(parent) ||
            ts.isClassDeclaration(parent) ||
            ts.isInterfaceDeclaration(parent) ||
            ts.isTypeAliasDeclaration(parent) ||
            ts.isParameter(parent) ||
            ts.isTypeParameterDeclaration(parent)) &&
            parent.name === node) {
            note(node, `${node.text} is declared here too: its uses are left as they are written`);
            return false;
        }
        return true;
    };
    const visitNames = (node) => {
        if (ts.isIdentifier(node) && renamedLocals.has(node.text) && isUse(node)) {
            const to = renamedLocals.get(node.text);
            const parent = node.parent;
            if (ts.isShorthandPropertyAssignment(parent))
                replace(node, `${node.text}: ${to}`);
            else if (ts.isExportSpecifier(parent) && !parent.propertyName)
                replace(node, `${to} as ${node.text}`);
            else
                replace(node, to);
        }
        const owner = ts.isPropertyAccessExpression(node) ? node.expression : ts.isQualifiedName(node) ? node.left : undefined;
        if (owner && ts.isIdentifier(owner) && namespaces.has(owner.text)) {
            const name = ts.isPropertyAccessExpression(node) ? node.name : node.right;
            const rename = ts.isIdentifier(name) ? renames.get(name.text) : undefined;
            if (rename) {
                replace(name, rename.to);
                told(node, `${owner.text}.${rename.from} → ${owner.text}.${rename.to}`);
            }
        }
        ts.forEachChild(node, visitNames);
    };
    visitNames(file);
    // 3. The props of the package's components, as JSX gives them.
    const componentOf = (tag) => {
        if (ts.isIdentifier(tag))
            return imported.get(tag.text);
        if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression) && namespaces.has(tag.expression.text)) {
            return renames.get(tag.name.text)?.to ?? tag.name.text;
        }
        return undefined;
    };
    const nameOf = (attribute) => attribute.name.getText(file);
    const givenTo = (attribute) => {
        const initializer = attribute.initializer;
        if (!initializer)
            return { kind: 'true' };
        if (ts.isStringLiteral(initializer))
            return { kind: 'word', text: initializer.text, node: initializer };
        if (ts.isJsxExpression(initializer) && initializer.expression) {
            let expression = initializer.expression;
            while (ts.isParenthesizedExpression(expression))
                expression = expression.expression;
            if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression))
                return { kind: 'word', text: expression.text, node: expression };
            if (expression.kind === ts.SyntaxKind.TrueKeyword)
                return { kind: 'boolean', value: true };
            if (expression.kind === ts.SyntaxKind.FalseKeyword)
                return { kind: 'boolean', value: false };
            return { kind: 'expression', node: expression };
        }
        return { kind: 'expression', node: initializer };
    };
    /** An expression as written, without its parentheses, `as const` or `satisfies`. */
    const bare = (node) => {
        let expression = node;
        while (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression)) {
            expression = expression.expression;
        }
        return expression;
    };
    /** An attribute taken away with the space before it. */
    const removeAttribute = (attribute) => edit(attribute.pos, attribute.end, '');
    const negated = (node) => {
        const text = node.getText(file);
        return ts.isIdentifier(node) || ts.isPropertyAccessExpression(node) || ts.isCallExpression(node) ? `!${text}` : `!(${text})`;
    };
    const propOf = (attribute, component, rule, names) => {
        const change = rule.change;
        const given = givenTo(attribute);
        if (names.has(change.to)) {
            removeAttribute(attribute);
            told(attribute, `${component}: ${rule.from} taken away, ${change.to} being given too`);
            return;
        }
        if (change.kind === 'rename') {
            replace(attribute.name, change.to);
            const values = change.values ?? {};
            if (given.kind === 'word' && values[given.text]) {
                replace(given.node, quoted(given.node, values[given.text]));
                told(attribute, `${component}: ${rule.from}="${given.text}" → ${change.to}="${values[given.text]}"`);
            }
            else {
                told(attribute, `${component}: ${rule.from} → ${change.to}`);
                if (given.kind === 'expression' && Object.keys(values).length) {
                    const pairs = Object.entries(values).map(([was, now]) => `${was} is ${now}`);
                    note(attribute, `${component}'s ${change.to} (formerly ${rule.from}) is computed: ${listed(pairs)} now`);
                }
            }
        }
        else if (change.kind === 'invert') {
            const text = given.kind === 'true' || (given.kind === 'boolean' && given.value)
                ? `${change.to}={false}`
                : given.kind === 'boolean'
                    ? change.to
                    : given.kind === 'expression'
                        ? `${change.to}={${negated(given.node)}}`
                        : undefined;
            if (text === undefined) {
                note(attribute, `${component}'s ${rule.from} is given a word: ${change.to} is the other way round`);
                return;
            }
            replace(attribute, text);
            told(attribute, `${component}: ${attribute.getText(file)} → ${text}`);
        }
        else {
            if (given.kind === 'boolean' && !given.value) {
                removeAttribute(attribute);
                told(attribute, `${component}: ${rule.from}={false} taken away`);
                return;
            }
            const text = given.kind === 'true' || given.kind === 'boolean'
                ? `${change.to}="${change.value}"`
                : given.kind === 'expression'
                    ? `${change.to}={${given.node.getText(file)} ? '${change.value}' : undefined}`
                    : undefined;
            if (text === undefined) {
                note(attribute, `${component}'s ${rule.from} is given a word: give ${change.to}="${change.value}" by hand`);
                return;
            }
            replace(attribute, text);
            told(attribute, `${component}: ${attribute.getText(file)} → ${text}`);
        }
    };
    const valueOf = (attribute, component, rules, names) => {
        const given = givenTo(attribute);
        if (given.kind === 'expression') {
            const pairs = rules.map((rule) => `"${rule.from}" is ${rule.to.prop === rule.prop ? `"${rule.to.value}"` : `${rule.to.prop}="${rule.to.value}"`}`);
            note(attribute, `${component}'s ${rules[0].prop} is computed: ${listed(pairs)} now`);
            return;
        }
        if (given.kind !== 'word')
            return;
        const rule = rules.find((candidate) => candidate.from === given.text);
        if (!rule)
            return;
        if (rule.to.prop === rule.prop) {
            replace(given.node, quoted(given.node, rule.to.value));
        }
        else if (names.has(rule.to.prop)) {
            removeAttribute(attribute);
        }
        else {
            replace(attribute, `${rule.to.prop}="${rule.to.value}"`);
        }
        told(attribute, `${component}: ${rule.prop}="${rule.from}" → ${rule.to.prop}="${rule.to.value}"`);
    };
    /** The objects written in the file under a name (`const levels = [...]`), the one declaration of it. */
    const declared = new Map();
    const visitDeclarations = (node) => {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
            declared.set(node.name.text, [...(declared.get(node.name.text) ?? []), node.initializer]);
        }
        ts.forEachChild(node, visitDeclarations);
    };
    visitDeclarations(file);
    const literalOf = (node, seen = new Set()) => {
        const expression = bare(node);
        if (ts.isIdentifier(expression) && !seen.has(expression.text) && declared.get(expression.text)?.length === 1) {
            return literalOf(declared.get(expression.text)[0], seen.add(expression.text));
        }
        return expression;
    };
    /** A value written in the objects an attribute is given (`levels={[{ …, tone: 'negative' }]}`), or in their declaration. */
    const nestedIn = (attribute, component, rules) => {
        const initializer = attribute.initializer;
        const given = initializer && ts.isJsxExpression(initializer) ? initializer.expression : undefined;
        if (!given)
            return;
        const prop = rules[0].prop;
        const expression = literalOf(given);
        if (!ts.isArrayLiteralExpression(expression) && !ts.isObjectLiteralExpression(expression)) {
            const pairs = rules.map((rule) => `"${rule.from}" is "${rule.to.value}"`);
            note(attribute, `${component}'s ${nameOf(attribute)} are made elsewhere: their ${prop}, ${listed(pairs)} now`);
            return;
        }
        const visit = (node) => {
            if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node))
                return;
            if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && node.name.text === prop) {
                const value = bare(node.initializer);
                if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
                    const rule = rules.find((candidate) => candidate.from === value.text);
                    if (rule) {
                        replace(value, quoted(value, rule.to.value));
                        told(node, `${component}'s ${nameOf(attribute)}: ${prop} '${rule.from}' → '${rule.to.value}'`);
                    }
                }
            }
            ts.forEachChild(node, visit);
        };
        visit(expression);
    };
    const visitJsx = (node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const component = componentOf(node.tagName);
            if (component) {
                const props = rules.props.filter((rule) => rule.components.has(component));
                const values = rules.values.filter((rule) => rule.components.has(component));
                const attributes = node.attributes.properties;
                const names = new Set(attributes.filter(ts.isJsxAttribute).map(nameOf));
                for (const attribute of attributes) {
                    if (ts.isJsxSpreadAttribute(attribute)) {
                        const olds = [...new Set([...props.map((rule) => rule.from), ...values.map((rule) => `${rule.prop}="${rule.from}"`)])];
                        if (olds.length)
                            note(attribute, `${component} is given a spread: ${listed(olds)}, if it holds them, to rename by hand`);
                        continue;
                    }
                    const name = nameOf(attribute);
                    for (const rule of props)
                        if (rule.from === name)
                            propOf(attribute, component, rule, names);
                    const direct = values.filter((rule) => rule.prop === name);
                    if (direct.length)
                        valueOf(attribute, component, direct, names);
                    const nested = values.filter((rule) => rule.nested.includes(name));
                    if (nested.length)
                        nestedIn(attribute, component, nested);
                }
            }
        }
        ts.forEachChild(node, visitJsx);
    };
    visitJsx(file);
    // 4. A value renamed in any object (a sidebar's sections, written apart from it), and what a toast is given.
    const toasts = new Set();
    const useToasts = new Set([...imported].filter(([, name]) => name === 'useToast').map(([local]) => local));
    const visitObjects = (node) => {
        if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))) {
            const value = bare(node.initializer);
            const key = node.name.text;
            if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
                const rule = rules.anywhere.find((candidate) => candidate.prop === key && candidate.from === value.text);
                if (rule) {
                    replace(value, quoted(value, rule.to.value));
                    told(node, `${key}: '${rule.from}' → '${rule.to.value}'`);
                }
            }
        }
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isCallExpression(node.initializer)) {
            const callee = node.initializer.expression;
            if (ts.isIdentifier(callee) && useToasts.has(callee.text))
                toasts.add(node.name.text);
        }
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && toasts.has(node.expression.text) && rules.toast.length) {
            const [message] = node.arguments;
            if (message && ts.isObjectLiteralExpression(message)) {
                const keys = new Set(message.properties.map((property) => property.name?.getText(file)));
                for (const rule of rules.toast) {
                    for (const property of message.properties) {
                        if (ts.isShorthandPropertyAssignment(property) && property.name.text === rule.from) {
                            replace(property, `${rule.to}: ${rule.from}`);
                            told(property, `toast(): ${rule.from} → ${rule.to}`);
                            const pairs = Object.entries(rule.values).map(([was, now]) => `${was} is ${now}`);
                            note(property, `toast()'s ${rule.to} (formerly ${rule.from}) is computed: ${listed(pairs)} now`);
                            continue;
                        }
                        if (!ts.isPropertyAssignment(property) || property.name.getText(file) !== rule.from)
                            continue;
                        if (keys.has(rule.to)) {
                            const at = message.properties.indexOf(property);
                            const next = message.properties[at + 1];
                            edit(property.getStart(file), next ? next.getStart(file) : property.end, '');
                            told(property, `toast(): ${rule.from} taken away, ${rule.to} being given too`);
                            continue;
                        }
                        replace(property.name, rule.to);
                        const value = bare(property.initializer);
                        if ((ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) && rule.values[value.text]) {
                            replace(value, quoted(value, rule.values[value.text]));
                            told(property, `toast(): ${rule.from}: '${value.text}' → ${rule.to}: '${rule.values[value.text]}'`);
                        }
                        else {
                            told(property, `toast(): ${rule.from} → ${rule.to}`);
                            if (!ts.isStringLiteral(value)) {
                                const pairs = Object.entries(rule.values).map(([was, now]) => `${was} is ${now}`);
                                note(property, `toast()'s ${rule.to} (formerly ${rule.from}) is computed: ${listed(pairs)} now`);
                            }
                        }
                    }
                }
            }
            else if (message) {
                note(node, `${node.expression.text}() is given a message made elsewhere: its ${listed(rules.toast.map((rule) => rule.from))}, if any, to rename by hand`);
            }
        }
        ts.forEachChild(node, visitObjects);
    };
    visitObjects(file);
    // The edits, from the end of the file: one inside another already made (an attribute rewritten whole) is dropped.
    const ordered = [...edits].sort((a, b) => a.start - b.start || b.end - a.end);
    const kept = [];
    for (const candidate of ordered) {
        const last = kept[kept.length - 1];
        if (last && candidate.start < last.end)
            continue;
        kept.push(candidate);
    }
    let output = source;
    for (const { start, end, text } of kept.reverse())
        output = output.slice(0, start) + text + output.slice(end);
    return { output, changes: changes.sort((a, b) => a.line - b.line), notes: notes.sort((a, b) => a.line - b.line) };
}
