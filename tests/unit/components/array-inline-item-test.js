import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {builtInRenderers} from 'bunsen-core/validator'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-array-inline-item',
  'FrostBunsenArrayInlineItemComponent',
  {
    unit: true
  },
  function () {
    let component, onChangeSpy, onRemoveSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()
      onRemoveSpy = sandbox.spy()

      component = this.subject({
        bunsenId: 'foo',
        bunsenModel: {
          properties: {
            foo: {
              items: {
                properties: {
                  bar: {type: 'string'}
                },
                type: 'object'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenStore: Ember.Object.create({
          formValue: {
            foo: [{}]
          },
          renderers: builtInRenderers,
          view: {}
        }),
        cellConfig: Ember.Object.create({
          arrayOptions: {
            itemCell: {}
          }
        }),
        errors: {},
        index: 0,
        onChange: onChangeSpy,
        onRemove: onRemoveSpy,
        sortable: false,
        value: {foo: []}
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      index: PropTypes.number.isRequired,
      onChange: PropTypes.func.isRequired,
      onRemove: PropTypes.func,
      readOny: PropTypes.bool,
      showRemoveButton: PropTypes.bool,
      sortable: PropTypes.bool.isRequired,
      value: PropTypes.object.isRequired
    })

    it('compact returns false when view config property is missing', function () {
      expect(component.get('compact')).to.be.false
    })

    it('compact returns false when view config property is set to false', function () {
      component.set('cellConfig.arrayOptions.compact', false)
      expect(component.get('compact')).to.be.false
    })

    it('compact returns true when view config property set to true', function () {
      component.set('cellConfig.arrayOptions.compact', true)
      expect(component.get('compact')).to.be.true
    })

    it('errorMessage returns null when no erorrs', function () {
      component.set('errors', {})
      expect(component.get('errorMessage')).to.be.null
    })

    it('errorMessage returns signle error', function () {
      const error = 'what is foo without a little bar'
      component.set('errors', {'foo.0': [error]})
      expect(component.get('errorMessage').toString()).to.eql(error)
    })

    it('errorMessage returns multiple errors', function () {
      const error1 = 'what is foo without a little bar'
      const error2 = 'baz is feeling lonely'
      component.set('errors', {'foo.0': [error1, error2]})
      expect(component.get('errorMessage').toString()).to.eql(`${error1}<br>${error2}`)
    })
  }
)
