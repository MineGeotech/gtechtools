import DS from 'ember-data';

export default DS.Model.extend({
    points: DS.hasMany('point'),
    polygons: DS.hasMany('polygon'),
    polylines: DS.hasMany('polyline')
});
