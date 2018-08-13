module.exports = {
  meta: {
    docs: {
      description: 'allow N number of characters for method arguments',
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
      MethodDefinition(node) {
        const methodText = sourceCode.getText(node.value);
        const name = node.key.name;

        if (!node.parent || node.parent.type !== 'ClassBody' || (name + methodText).length <= charLimit) {
          return;
        }

        context.report({
          node,
          message: 'method signature exceeds the max characters',
          fix(fixer) {
            return fixer.replaceText(node, [
              `${name} (`,
              ...node.value.params.map((spec, index) => {
                let newText = indentChar + sourceCode.getText(spec);

                if (index !== node.value.params.length - 1) {
                  newText += ',';
                }

                return newText;
              }),
              `) ${sourceCode.getText(node.value.body)}`
            ].join('\n'));
          }
        })
      }
    }
  }
};
