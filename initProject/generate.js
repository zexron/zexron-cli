/**
 * Author: Nick.Xu
 * Date: 2018-02-27 10:47:9
 * -----
 * Last Modified: 2018-02-28 11:45:34
 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const JSZip = require('jszip')
const chalk = require('chalk')
const ora = require('ora')
const zip = new JSZip()
const AVAILABLE_TYPES = ['gulp', 'gulp2', 'webpack']

/**
 * Generate target folder
 * @param {String} dir
 */
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

/**
 * Copy template
 * @param  {String} type
 * @param  {String} dir
 */
exports.generate = function (type, dir) {
  const targetDir = dir || '.'

  if (AVAILABLE_TYPES.indexOf(type) < 0) {
    throw new Error(`No Such Type: ${type}`)
  }

  console.log('')
  console.log('Start generating', chalk.cyan.underline(type))
  console.log('')

  makeTarget(dir)

  downloadFile(type)
    .then((data) => {
      // Copy files and make folders
      Object.keys(data.files).forEach(key => {
        const filePath = path.join(targetDir, key)
        if (data.files[key].dir) {
          fs.mkdirSync(filePath)
        } else {
          const buffer = zip.file(key).async('string')
            .then(function (data) {
              fs.writeFileSync(filePath, data)
            })
        }
      })

      console.log('')
      console.log(chalk.green('Success create', chalk.cyan.underline(type), 'on'))
      console.log(`  ${path.resolve(targetDir)}`)
      console.log('')
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
/**
 * Download zip file from 404
 * @param  {String} type
 */
function downloadFile (type) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Downloading ${chalk.underline.cyan(`${type}.zip`)}`).start()
    const request = http.get(`http://www.status404.cn/BuildTool/${type}.zip`, (res) => {
      if (res.statusCode !== 200) {
        spinner.fail(`Fail on downloading ${chalk.underline.cyan(`${type}.zip`)}: ${res.statusCode}`)
        reject()
        return
      }
      let data = []
      let dataLen = 0

      res.on('data', (chunk) => {
        data.push(chunk)
        dataLen += chunk.length
      })

      res.on('end', () => {
        const buf = Buffer.concat(data)

        zip
          .loadAsync(buf)
          .then((zip) => {
            spinner.succeed(`Download Success ${chalk.underline.cyan(`${type}.zip`)}`)
            resolve(zip)
          })
      })
    })

    request.on('error', (err) => {
      spinner.fail(`Fail on downloading ${chalk.underline.cyan(`${type}.zip`)}`)
      reject(err)
    })
  })
}
