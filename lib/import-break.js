module.exports = {
  meta: {
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
        indentChar: { type: 'string' }
      }
    } ]
  },
  create(context)  {
    const sourceCode = context.getSourceCode();
    const { charLimit = 80, indentChar = '  ' } = context.options[0] || {};

    return {
      ImportDeclaration(node) {
        const importText = sourceCode.getText(node);
        const specifiers = node.specifiers;
        const defaultSpecifier = specifiers.find(spec => spec.type === 'ImportDefaultSpecifier');
        const namedSpecifiers = specifiers.filter(spec => spec.type === 'ImportSpecifier');

        if (!namedSpecifiers.length || importText.length <= charLimit) {
          return;
        }

        context.report({
          node,
          message: 'import statement exceeds the max characters',
          fix(fixer) {
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
        });
      }
    }
  }
};
