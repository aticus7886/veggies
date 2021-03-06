'use strict'

jest.mock('fs')

const yamlContent = { type: 'yaml', testing: true }
const textContent = 'This data were loaded from mocked text file'
const jsonContent = { type: 'json', testing: true }
const jsContent = { type: 'javascript module', testing: true }

jest.mock(
    '../../../fixture.js',
    () => {
        // `jest.mock()` is not allowed to reference any out-of-scope variables
        return () => ({ type: 'javascript module', testing: true })
    },
    { virtual: true }
)

jest.mock('../../../fixture.js.no_default_function', () => ({}), { virtual: true })

const yaml = require('js-yaml')
const FixturesLoader = require('../../../src/extensions/fixtures/fixtures_loader')

const MOCK_FILES = {
    'fixture.yaml': yaml.dump(yamlContent),
    'fixture.yaml.empty': '',
    'fixture.yaml.invalid': ':\ninvalid',
    'fixture.txt': textContent,
    'fixture.json': JSON.stringify(jsonContent),
    'fixture.json.invalid': 'invalid'
}

const MOCK_GLOBS = {
    '/yaml/fixture.@(yaml|yml|js|json|txt)': ['fixture.yaml'],
    '/txt/fixture.@(yaml|yml|js|json|txt)': ['fixture.txt'],
    '/js/fixture.@(yaml|yml|js|json|txt)': ['fixture.js'],
    '/json/fixture.@(yaml|yml|js|json|txt)': ['fixture.json'],
    '/multi/fixture.@(yaml|yml|js|json|txt)': ['fixture.json', 'fixture.yaml']
}

beforeEach(() => {
    require('fs').__setMockFiles(MOCK_FILES)
    require('glob')('__defineMocks', MOCK_GLOBS)
})

afterEach(() => {
    FixturesLoader.reset()
})

test('configure', () => {
    FixturesLoader.configure({ fixturesDir: 'other' })
})

test('set feature uri', () => {
    FixturesLoader.setFeatureUri('feature/uri')
})

test('load valid .yaml fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadYaml('fixture.yaml').then(data => {
        expect(data).toEqual(yamlContent)
    })
})

test('load non existing .yaml fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadText('noent.yaml').catch(err => expect(err.message).toEqual('File does not exist (noent.yaml)'))
})

test('load empty .yaml fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadYaml('fixture.yaml.empty').catch(err =>
        expect(err.message).toMatch('Fixture file is invalid, yaml parsing resulted in undefined data for file: fixture.yaml.empty')
    )
})

test('load invalid .yaml fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadYaml('fixture.yaml.invalid').catch(err => {
        expect(err.message).toMatch('Unable to parse yaml fixture file: fixture.yaml.invalid')
    })
})

test('generic load of .yaml fixture file', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'yaml' })
    FixturesLoader.setFeatureUri('yaml')

    return FixturesLoader.load('fixture').then(data => {
        expect(data).toEqual(yamlContent)
    })
})

test('load valid .txt fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadText('fixture.txt').then(data => {
        expect(data).toEqual(textContent)
    })
})

test('load non existing .txt fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadText('noent.txt').catch(err => expect(err.message).toEqual('File does not exist (noent.txt)'))
})

test('generic load of .txt fixture file', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'txt' })
    FixturesLoader.setFeatureUri('txt')

    return FixturesLoader.load('fixture').then(data => {
        expect(data).toEqual(textContent)
    })
})

test('load valid .js fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadModule('fixture.js').then(data => {
        expect(data).toEqual(jsContent)
    })
})

test('load non existing .js fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadModule('noent.js').catch(err => {
        expect(err.message).toEqual(
            [
                'An error occurred while loading fixture file: noent.js',
                `error: Cannot find module '../../../noent.js' from 'fixtures_loader.js'`
            ].join('\n')
        )
    })
})

test('load .js without default exported function', () => {
    expect.assertions(1)

    return FixturesLoader.loadModule('fixture.js.no_default_function').catch(err => {
        expect(err.message).toEqual(
            [
                'javascript fixture file should export default function.',
                `Make sure you declared 'module.exports = <function>' in fixture.js.no_default_function`
            ].join('\n')
        )
    })
})

test('generic load of .js fixture file', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'js' })
    FixturesLoader.setFeatureUri('js')

    return FixturesLoader.load('fixture').then(data => {
        expect(data).toEqual(jsContent)
    })
})

test('load valid .json fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadJson('fixture.json').then(data => {
        expect(data).toEqual(jsonContent)
    })
})

test('load non existing .json fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadJson('noent.json').catch(err => expect(err.message).toEqual('File does not exist (noent.json)'))
})

test('load invalid .json fixture file', () => {
    expect.assertions(1)

    return FixturesLoader.loadJson('fixture.json.invalid').catch(err =>
        expect(err.message).toMatch('Unable to parse json fixture file: fixture.json.invalid')
    )
})

test('generic load of .json fixture file', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'json' })
    FixturesLoader.setFeatureUri('json')

    return FixturesLoader.load('fixture').then(data => {
        expect(data).toEqual(jsonContent)
    })
})

test('generic load without feature uri', () => {
    expect.assertions(1)

    FixturesLoader.setFeatureUri(undefined)

    return FixturesLoader.load('fixture').catch(err => {
        expect(err.message).toEqual('Cannot load fixture: fixture, no feature uri defined')
    })
})

test('generic load with no matching fixture file', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'none' })
    FixturesLoader.setFeatureUri('none')

    return FixturesLoader.load('fixture').catch(err => {
        expect(err.message).toEqual('No fixture found for: fixture (/none/fixture.@(yaml|yml|js|json|txt))')
    })
})

test('generic load with multiple matching fixture files', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'multi' })
    FixturesLoader.setFeatureUri('multi')

    return FixturesLoader.load('fixture').catch(err => {
        expect(err.message).toEqual(
            [`Found 2 matching fixture files, you should have only one matching 'fixture':`, '  - fixture.json', '  - fixture.yaml'].join(
                '\n'
            )
        )
    })
})

test('generic load with multiple matching fixture files', () => {
    expect.assertions(1)

    FixturesLoader.configure({ fixturesDir: 'multi' })
    FixturesLoader.setFeatureUri('multi')

    return FixturesLoader.load('fixture').catch(err => {
        expect(err.message).toEqual(
            [`Found 2 matching fixture files, you should have only one matching 'fixture':`, '  - fixture.json', '  - fixture.yaml'].join(
                '\n'
            )
        )
    })
})

test('reset fixtures', () => {
    FixturesLoader.reset()
})
