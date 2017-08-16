import Ember from 'ember';
const path = window.require('path');

export default Ember.Component.extend({
    fileType: '',
    filePath: '',
    pfile: '',
    savePath: '',
    dataFile: '',
    decimalPlaces: 2,
    coordSettings:'XY',
    importFile: Ember.inject.service(),
    exportFile: Ember.inject.service(),

    init() {
        this._super(...arguments);
        this.addObserver('model.currentFile', this, 'modelChanged');
        this.set('dataFile', {
            points: [],
            polygons: [],
            polylines: []
        });
        //this.model.addObserver('currentFile',this.fileChanged);

    },
    modelChanged() {

        var cf = this.get('model.currentFile');

        if (cf == null || cf == '') return;
        this.set('pFile', path.parse(cf));
        this.set('savePath', this.pFile.dir);
        if (this.filePath != cf) {
            this.set('filePath', cf);
            this.set('dataFile', {
                points: [],
                polygons: [],
                polylines: []
            });

            this.get('importFile').import(cf).then(dataFile => {

                this.set('dataFile', dataFile);
            });

        }

    },
    actions: {
        exportFile() {
            this.get('exportFile').export(this.dataFile, this.savePath, this.pFile.name, this.decimalPlaces);
        },
        selectCoord(coord) {
            this.set('coordSettings', coord);
          }
    }
});