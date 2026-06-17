import fs from 'node:fs'
import path from 'node:path'

function syncVersion() {
  const packagePath = path.resolve(process.cwd(), 'package.json')
  const readmePath = path.resolve(process.cwd(), 'README.md')

  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const currentVersion = packageData.version

  if (!currentVersion) {
    console.error('ERROR: Failed to find version in package.json')
    process.exit(1)
  }

  let readmeText = fs.readFileSync(readmePath, 'utf8')

  const badgeRegex = /(!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-)([\d.]+)(-blue\?style=for-the-badge\))/

  if (badgeRegex.test(readmeText)) {
    readmeText = readmeText.replace(badgeRegex, `$1${currentVersion}$3`)
    fs.writeFileSync(readmePath, readmeText)
    console.log(`INFO: README.md synced to version ${currentVersion}`)
  } else {
    console.warn('WARN: Could not find version badge in README.md')
  }
}

syncVersion()
