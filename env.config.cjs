// Package-local bootstrap; no repository root or sibling directory is read.
const { applyPackageEnv } = require('@melt-js/libs-core/scripts/package-env.cjs')
module.exports = applyPackageEnv({ cwd: __dirname })
