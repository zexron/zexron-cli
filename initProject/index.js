#! /usr/bin/env node
/**
 * Author: Nick.Xu
 * Date: 2018-02-27 10:20:20
 * -----
 * Last Modified: 2018-02-27 11:15:44
 */

const program = require('commander')
const generate = require('./generate').generate

program
  .command('generate <type>')
  .alias('g')
  .description('Initialize your project (default as -g2)')
  .option('-d, --dir <dir>', 'Specify install folder')
  .action(function (type, command) {
    generate(type, command.dir)
  })
  .on('--help', function () {
    console.log('')
    console.log('  Examples:')
    console.log('')
    console.log('    $ z-cli generate gulp')
    console.log('    $ z-cli g gulp -d /path/to/your/project')
    console.log('')
    console.log('  Types:')
    console.log('')
    console.log('    gulp, gulp2, webpack')
    console.log('')
  })

program.parse(process.argv)
