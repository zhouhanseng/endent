const dedent = require('dedent')
const objectorarray = require('objectorarray')
const parse = require('fast-json-parse')

module.exports = endent

const ENDENT_ID = 'twhZNwxI1aFG3r4'

function endent (strings, ...values) {
  const raw = typeof strings === 'string' ? [strings] : strings.raw

  let result = ''

  for (let i = 0; i < raw.length; i++) {
    result += raw[i]

    if (i < values.length) {
      let value = values[i]
      let isJson = false

      if (parse(value).value) {
        value = parse(value).value
        isJson = true
      }

      if ((value && value[ENDENT_ID]) || isJson) {
        let rawlines = result.split('\n')
        let l = rawlines[rawlines.length - 1].search(/\S/)
        let endentation = l > 0 ? ' '.repeat(l) : ''
        let valueJson = isJson ? JSON.stringify(value, null, 2) : value[ENDENT_ID]
        let valueLines = valueJson.split('\n')

        valueLines.forEach((l, index) => {
          if (index > 0) {
            result += ('\n' + endentation + l)
          } else {
            result += l
          }
        })
      } else if (typeof value === 'string' && value.includes('\n')) {
        let endentations = result.match(/(?:^|\n)( *)$/)

        if (endentations && typeof value === 'string') {
          let endentation = endentations[1]
          result += value
            .split('\n')
            .map((str, i) => i === 0 ? str : `${endentation}${str}`)
            .join('\n')
        } else {
          result += value
        }
      } else {
        result += value
      }
    }
  }

  return dedent(result)
}

endent.pretty = (data) => {
  return objectorarray(data) ? {[ENDENT_ID]: JSON.stringify(data, null, 2)} : data
}
