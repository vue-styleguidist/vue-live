const fs = require('fs')
const path = require('path')
let dir = path.resolve(__dirname, 'lib')

function loadModule(name) {
    try { return require(name) } catch (e) { return undefined }
}

function copy(name) {
    const src = path.join(dir, 'vue3', name)
    const dest = path.join(dir, name)

    let content = fs.readFileSync(src, 'utf-8')

    try { fs.unlinkSync(dest) } catch (error) {
      // eat error if file doesn't exist
    }
    fs.writeFileSync(dest, content, 'utf-8')
}

const Vue = loadModule('vue')

if (!Vue || typeof Vue.version !== 'string') {
    console.warn('[vue-live] Vue is not found. Please run "npm install vue" to install.')
} else if (Vue.version.startsWith('3.')) {
    console.log(`[vue-live] installing for vue3 from dir ${dir}`)
    copy('vue-live.esm.js')
    copy('vue-live.common.js')
}