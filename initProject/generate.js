/**
 * Author: Nick.Xu
 * Date: 2018-02-27 10:47:9
 * -----
 * Last Modified: 2018-02-27 12:09:46
 */

const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const chalk = require('chalk')
const zip = new JSZip()
const AVAILABLE_TYPES = ['gulp', 'gulp2', 'webpack']

function makeTarget (dir) {
  const targetPath = dir || './'
  const relativePaths = path.resolve(targetPath).split('/')
  let currPath = ''
  relativePaths.forEach((p) => {
    currPath += `${p}/`
    if (!fs.existsSync(currPath)) {
      fs.mkdirSync(currPath)
    }
  })
}

exports.generate = function (type, dir) {
  if (AVAILABLE_TYPES.indexOf(type) < 0) {
    throw new Error(`No Such Type: ${type}`)
  }

  makeTarget(dir)
  new JSZip.external.Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, `templates/${type}.zip`), (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
    .then((data) => zip.loadAsync(data))
    .then((data) => {
      Object.keys(data.files).forEach(key => {
        const filePath = path.join(dir, key)
        if (data.files[key].dir) {
          fs.mkdirSync(filePath)
        } else {
          const buffer = zip.file(key).async('arraybuffer')
            .then(function (data) {
              fs.writeFileSync(filePath, buffer)
            })
        }
      })
      console.log('')
      console.log(chalk.green('Success create', chalk.cyan.underline(type), 'on'))
      console.log(`  ${path.resolve(dir || './')}`)
      console.log('')
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
