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

        console.log(name + methodText);
      }
    }
  }
};
