const matchAll = require('string.prototype.matchall');
import _ from 'lodash'

export default function render(str) {
  if (str === undefined) return str;
  str = str.replace(/\t/g, '  ')
  const stack = []
  const lines = matchAll(str, /^([ \t]*)(.+)$/gm)
  const result = []

  let indentIn = 0
  let isRawStr = false
  let rawIndent = null;

  function closeSvelteBlock(curind, opt = {}) {
      const idx = _.findIndex(stack, ({rawindent}) => rawindent >= curind)
      if (idx == -1) return null
      const newIndent = _.get(stack, [idx, "indent"], 0)
      for (const {indent, str, rawindent} of _.reverse(stack.splice(idx))) {
        if (str != null) {
          console.log('pop', indent, str, `${rawindent} >= ${curind}`)
          result.push(_.repeat('  ', indent) + `| {\\${str}}`)
        } else {
          console.log('skip', indent)
        }
      }
      console.log('new indent', newIndent)
      return newIndent
  }
  function pushString(ind, str) {
    result.push(_.repeat('  ', ind) + str)
    console.log([indentIn, !!isRawStr], _.last(result))
    if (!isRawStr) {
      if (_.endsWith(str, '.')) isRawStr = true;
      if (!_.startsWith(str, '|')) indentIn += 1
    }
  }

  for (const line of lines) {
    const curIndent = line[1].length
    const matchSvalteBlock = line[2].match(/^{[#@:](if|each|else|else if|html|debug)\s*(.*)}$/)
    console.log("TCL: curIndent", curIndent, rawIndent)

    if (curIndent == 0) {
      isRawStr = false;
      closeSvelteBlock(curIndent);
      indentIn = 0
    }
    if (isRawStr && curIndent < rawIndent) {
      isRawStr = false;
      indentIn = closeSvelteBlock(curIndent) || 0;
    }
    if (isRawStr) pushString(indentIn, line[2])

    if (matchSvalteBlock) {
      let isElse = line[2].match(/:else/)
      indentIn = closeSvelteBlock(curIndent + 3) || indentIn;
      pushString(indentIn, '| ' + line[2])
      if (!_.startsWith(matchSvalteBlock[1], 'else')) { // need to close
        stack.push({rawindent: curIndent, indent: indentIn, str: matchSvalteBlock[1]})
      }
    }
    else {
      const oldRawStr = isRawStr;
      pushString(indentIn, line[2])
      stack.push({rawindent: curIndent, indent: indentIn, str: null})
      if (!oldRawStr && isRawStr) {
        rawIndent = curIndent
      }
    }
  }
  console.log(result.join('\n'))
  return result.join('\n')
  return str;
}
