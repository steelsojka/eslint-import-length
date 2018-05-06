const rule = require('../../../lib/import-break');
const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } });

tester.run('import-break', rule, {
  valid: [ {
    code: `import { Test, Test2 } from 'my-test-package';`,
    options: [ 60 ]
  } ],
  invalid: [ {
    code: `import { Test, Test2 } from 'my-test-package';`,
    options: [ 40 ],
    errors: 1,
    output: [
      'import {',
      '  Test,',
      '  Test2',
      '} from \'my-test-package\';'
    ].join('\n')
  } ]
})