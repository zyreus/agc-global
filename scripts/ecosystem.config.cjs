/**
 * PM2 ecosystem entry point (PM2 requires *.config.cjs in the filename).
 * Delegates to the optimized local config at repo root.
 */
module.exports = require('../ecosystem.config.local.cjs')
