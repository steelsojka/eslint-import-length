module.exports = {
  meta: {
    docs: {
      description: 'allow N number of characters for import statements',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: 'code',
    schema: [ {
      'type': 'number'
    }, {
      'type': 'string'
    } ]
  },
  create(context)  {
    const sourceCode = context.getSourceCode();
    const breakLimit = context.options[0] || 80;
    const breakIndentChar = context.options[1] || '  ';

    return {
      ImportDeclaration(node) {
        const importText = sourceCode.getText();

        if (importText.length <= breakLimit) {
          return;
        }

        const specifiers = node.specifiers;

        context.report({
          node,
          message: 'import statement exceeds the max characters',
          fix(fixer) {
            fixer.replaceText(node, [
              'import {',
              ...specifiers.map((spec, index) => {
                let newText = breakIndentChar + sourceCode.getText(spec);

                if (index !== specifiers.length - 1) {
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
