# Ischanged [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMURL]: https://npmjs.org/package/ischanged "npm"
[NPMIMGURL]: https://img.shields.io/npm/v/ischanged.svg?style=flat&longCache=true
[BuildStatusURL]: https://github.com/coderaiser/ischanged/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/ischanged/workflows/Node%20CI/badge.svg
[DependencyStatusIMGURL]: https://david-dm.org/coderaiser/ischanged.svg?path=packages/ischanged
[DependencyStatusURL]: https://david-dm.org/coderaiser/ischanged?path=packages/ischanged "Dependency Status"
[CoverageURL]: https://coveralls.io/github/coderaiser/ischanged?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/ischanged/badge.svg?branch=master&service=github

Check time of file modification. If it's changed probable file was changed to.
There is no 100% assurance that is was, but it works much faster then check by hash.

## Install

`npm i ischanged --save`

## Hot to use?

```js
const ischanged = require('ischanged');

const is = await ischanged('/etc/passwd');
// returns
true

await ischanged('/etc/passwd');
// returns
false
```

## How it works?

`Ischanged` saves time of file modification to file `ischanged/<uid>/changes.json`
in Temp directory and then checks whas it changed or not.

So it something like `watch` but:

- should be called by hand;
- could detect modifications after restart of application;

## License

MIT
