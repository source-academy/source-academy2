import * as fs from 'fs'
import * as path from 'path'
import { parse } from '../parser'
import { generateCFG } from '../cfg'
import { numberT, stringT, booleanT } from '../types/static'
import { typecheck, isCompatible, parseString } from '../typechecker'
import {
  parseTypecheckerTest,
  runTypecheckerTest
} from '../harness/typechecker'

it('isSameType works correctly', () => {
  expect(isCompatible(numberT, numberT)).toBe(true)
  expect(isCompatible(booleanT, booleanT)).toBe(true)
  expect(isCompatible(stringT, stringT)).toBe(true)
  expect(
    isCompatible(
      {
        name: 'function',
        params: [numberT],
        returnType: numberT
      },
      {
        name: 'function',
        params: [numberT],
        returnType: numberT
      }
    )
  ).toBe(true)
  expect(isCompatible(stringT, numberT)).toBe(false)
  expect(
    isCompatible(
      {
        name: 'function',
        params: [stringT],
        returnType: numberT
      },
      {
        name: 'function',
        params: [numberT],
        returnType: numberT
      }
    )
  ).toBe(false)
  expect(
    isCompatible(
      {
        name: 'function',
        params: [stringT],
        returnType: numberT
      },
      {
        name: 'function',
        params: [stringT],
        returnType: stringT
      }
    )
  ).toBe(false)
})

it('parseString works correctly', () => {
  expect(parseString('number')).toBe(numberT)
  expect(parseString('string')).toBe(stringT)
  expect(parseString('boolean')).toBe(booleanT)
})

it('pass week 3 typecheckers suites', done => {
  const file = path.resolve(__dirname, 'fixtures', 'typechecker', 'week-3.js')
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      fail(err)
      done()
    } else {
      const suites = parseTypecheckerTest(data)
      runTypecheckerTest(suites, parse, generateCFG, typecheck)
      done()
    }
  })
})
