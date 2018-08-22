export const meta = {
  docs: {
    description: 'allow N number of characters for import statements',
    category: 'Possible Errors',
    recommended: true
  },
  fixable: 'code',
  schema: [ {
    type: 'object',
    properties: {
      charLimit: { type: 'number' },
      indentChar: { type: 'string' },
      oneNamedImportPerLine: { type: 'boolean' }
    }
  } ]
};

export function create(context) {
  const sourceCode = context.getSourceCode();
  const { charLimit = 80, indentChar = '  ', oneNamedImportPerLine = true } = context.options[0] || {};

  return {
    ImportDeclaration(node) {
      const importText = sourceCode.getText(node);
      const specifiers = node.specifiers;
      const pathLength = node.source.raw.length;
      const pathLine = node.loc.start.line;
      const defaultSpecifier = specifiers.find(spec => spec.type === 'ImportDefaultSpecifier');
      const namedSpecifiers = specifiers.filter(spec => spec.type === 'ImportSpecifier');
      const namedSpecifiersByLine = namedSpecifiers.reduce((res, specifier) => {
        const line = specifier.loc.start.line;
        if (!res[line]) {
          res[line] = [];
        }

        res[line].push(specifier);

        return res;
      }, {});

      function fix(fixer) {
        return fixer.replaceText(node, [
          defaultSpecifier ? `import ${sourceCode.getText(defaultSpecifier)}, {` : 'import {',
          ...namedSpecifiers.map((spec, index) => {
            let newText = indentChar + sourceCode.getText(spec);

            if (index !== namedSpecifiers.length - 1) {
              newText += ',';
            }

            return newText;
          }),
          `} from ${node.source.raw};`
        ].join('\n'));
      }

      if (!namedSpecifiers.length) {
        return;
      }

      if (oneNamedImportPerLine && Object.keys(namedSpecifiersByLine).length > 1) {
        for (const line of Object.keys(namedSpecifiersByLine)) {
          if (namedSpecifiersByLine[line].length > 1) {
            context.report({
              node,
              fix,
              message: 'only one named import per line allowed'
            });

            return;
          }
        }
      }

      for (const line of Object.keys(namedSpecifiersByLine)) {
        const specifiers = namedSpecifiersByLine[line];
        let length = 0;

        for (const [ index, spec ] of specifiers.entries()) {
          length += spec.range[1] - spec.range[0];

          if (specifiers[index + 1]) {
            length += (specifiers[index + 1].range[0] - spec.range[1]);
          }
        }

        if (Number(line) === pathLine) {
          length += node.source.range[1] - specifiers[specifiers.length - 1].range[1];
        }

        if (Number(line) === node.loc.start.line) {
          length += specifiers[0].range[0];
        }

        if (length > charLimit) {
          context.report({
            node,
            fix,
            message: 'import statement exceeds the max characters'
          });

          return;
        }
      }
    }
  }
}
