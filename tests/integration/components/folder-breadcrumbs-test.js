import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('folder-breadcrumbs', 'Integration | Component | folder breadcrumbs', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{folder-breadcrumbs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#folder-breadcrumbs}}
      template block text
    {{/folder-breadcrumbs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
