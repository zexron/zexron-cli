#! /usr/bin/env node
/**
 * Author: Nick.Xu
 * Date: 2018-02-27 09:53:18
 * -----
 * Last Modified: 2018-02-27 11:12:40
 */

const program = require('commander')

program
  .version(require('./package').version)
  .usage('<command> [options]')
  .command('init <type>', 'Initialize a project with template')
  .parse(process.argv)

require('./initProject')
