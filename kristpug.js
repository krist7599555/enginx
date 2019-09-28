const matchAll = require('string.prototype.matchall');
import _ from 'lodash'
import pug from 'pug'

export function pugsvelte2pug(str) {

  if (!str) return str;

  const lines = str.replace(/\t/g, '  ').split('\n').reduce((arr, line) => {
    const m = line.match(/^([ \t]*)([^ ].*)$/)
    if (!m) {
      // console.log('not match', line)
    }
    m && console.assert(m[1].length % 2 == 0)
    m && arr.push([m[1].length / 2, m[2]])
    return arr
  }, [])

  function render() {
    return lines.map(([space, str]) => _.repeat('  ', space) + str).join('\n')
  }

  // console.log(render())
  for (let i = 0; i < lines.length; ++i) {
    const [space, str] = lines[i]
    const m = str.match(/^{#(if|each)\s?.*}$/)
    if (m) {
      const key = m[1]
      let j = i + 1;
      lines[i][1] = "| " + lines[i][1]
      for (; j < lines.length && lines[j][0] >= lines[i][0]; ++j) {
        if (lines[j][0] > lines[i][0]) lines[j][0] -= 1
        else if (lines[j][1].startsWith("{:")) lines[j][1] = "| " + lines[j][1]
        else break
      }
      lines.splice(j, 0, [lines[i][0], `| {/${key}}`])
    }
    while (1) {
      const tag = lines[i][1].match(/^[\.\-\_a-zA-Z0-9]+\(.*=(\{([^']+)\}).*\)/)
      if (tag === null) break;
      const quote = tag[1].indexOf("'") == -1 ? "'" : '"'
      // console.log([tag[1]])
      lines[i][1] = lines[i][1].replace(tag[1], quote + _.escape(tag[1]) + quote)
      // console.log([lines[i][1]])
    }
  }
  // console.log(render())
  return render()
}

export default function render2html(str, opts) {
  const pre = pugsvelte2pug(str)
    // .replace(/ => /g, " =&gt; ")
    // .replace(/"/g, "&quot;")
  const out = pug.render(pre, { ...opts, doctype: 'html' })
  const uesc = _.unescape(out).replace(/&gt;/gm, ">")
  // console.log('----ESCAPE----')
  // console.log(out)
  // console.log('----UNESCAPE----')
  // console.log(uesc)
  // console.log('-------------------')
  return uesc
}
