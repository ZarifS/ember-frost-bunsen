import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: frost-bunsen-detail', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    let props = {
      bunsenModel: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            title: 'First Name'
          },
          lastName: {
            type: 'string',
            title: 'Last Name'
          },
          alias: {
            type: 'string',
            title: 'Alias'
          }
        }
      },
      value: {
        firstName: 'John',
        lastName: 'Doe',
        alias: 'Johnny'
      }
    }

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-detail
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      value=value
    }}`)

    rootNode = this.$('> *')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-detail')
  })

  it('displays initial value', function () {
    const $values = this.$('.frost-bunsen-left-input p')
    const displayValue = {
      firstName: $values.eq(0).text(),
      lastName: $values.eq(1).text(),
      alias: $values.eq(2).text()
    }
    expect(displayValue).to.eql({
      firstName: 'John',
      lastName: 'Doe',
      alias: 'Johnny'
    })
  })

  it('updates the displayed value when the value is changed', function () {
    let newValue = {
      firstName: 'Jane',
      lastName: 'Doe',
      alias: 'Killer'
    }

    this.set('value', newValue)

    const $values = this.$('.frost-bunsen-left-input p')
    const firstName = $values.eq(0).text()
    const lastName = $values.eq(1).text()
    const alias = $values.eq(2).text()

    expect(firstName).to.equal(newValue.firstName)
    expect(lastName).to.equal(newValue.lastName)
    expect(alias).to.equal(newValue.alias)
  })

  it('displays an error message if the bunsenModel is not valid', function () {
    this.set('bunsenModel', {type: 'invalid'})
    const errorMessage = this.$('.frost-bunsen-detail .frost-bunsen-validation-result h4').text().trim()
    expect(errorMessage).to.equal('There seems to be something wrong with your model schema')
  })

  it('displays an error message if the model property in the view is not valid', function () {
    const invalidView = {
      cellDefinitions: {
        main: {
          children: [
            {model: 'some.non-existing.property'}
          ]
        }
      },
      cells: [{extends: 'main'}],
      type: 'form',
      version: '2.0'
    }
    this.set('bunsenView', invalidView)

    const errorMessage = this.$('.frost-bunsen-detail .frost-bunsen-validation-result h4').text().trim()
    expect(errorMessage).to.equal('There seems to be something wrong with your view schema')
  })
})
