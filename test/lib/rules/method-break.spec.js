const rule = require('../../../lib/rules/method-break');
const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run('method-break', rule, {
  valid: [ {
    code: [
      'class Test {',
      '  constructor(arg1, arg2, arg3) {}',
      '}'
    ].join('\n'),
    options: [ { charLimit: 60 } ]
  } ],
  invalid: [ {
    code: [
      'class Test {',
      '  constructor(arg1, arg2, arg3, awwwwwwwwwwwwwwwwwwwwwwwwwwwwww) {',
      '    this.test = 123;',
      '  }',
      '}'
    ].join('\n'),
    errors: 1,
    output: [
      'class Test {',
      '  constructor(',
      '    arg1,',
      '    arg2,',
      '    arg3,',
      '    awwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
      '  ) {',
      '    this.test = 123;',
      '  }',
      '}'
    ].join('\n'),
    options: [ { charLimit: 60 } ]
  } ]
});