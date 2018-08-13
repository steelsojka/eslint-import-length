const rule = require('../../../lib/rules/import-break');
const RuleTester = require('eslint').RuleTester;
const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } });

tester.run('import-break', rule, {
  valid: [ {
    code: `import { Test, Test2 } from 'my-test-package';`,
    options: [ { charLimit: 60 } ]
  }, {
    code: `import ThisIsAReallyLongDefaultExportThatCanNotBeWrapped from 'my-test-package';`,
    options: [ { charLimit: 60 } ]
  }, {
    code: `import 'my-test-package-super';`,
    options: [ { charLimit: 20 } ]
  }, {
    code: `import Blorg, { Blorgy } from 'my-test-package';`,
    options: [ { charLimit: 80 } ]
  } ],
  invalid: [ {
    code: `import { Test, Test2 } from 'my-test-package';`,
    options: [ { charLimit: 40 } ],
    errors: 1,
    output: [
      'import {',
      '  Test,',
      '  Test2',
      '} from \'my-test-package\';'
    ].join('\n')
  }, {
    code: `import MyDefault, { Test, Test2 } from 'my-test-package';`,
    options: [ { charLimit: 40 } ],
    errors: 1,
    output: [
      'import MyDefault, {',
      '  Test,',
      '  Test2',
      '} from \'my-test-package\';'
    ].join('\n')
  }, {
    code: `import { Test } from 'my-test-package-with-some-really-long-package-name';`,
    options: [ { charLimit: 70, indentChar: '    ' } ],
    errors: 1,
    output: [
      'import {',
      '    Test',
      '} from \'my-test-package-with-some-really-long-package-name\';'
    ].join('\n')
  } ]
});