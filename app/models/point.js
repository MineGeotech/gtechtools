import DS from 'ember-data';

export default DS.Model.extend({
    id: DS.attr(),
    x: DS.attr('number'),
    y: DS.attr('number'),
    z: DS.attr('number'),
    pointOrder: DS.attr('number')
});
