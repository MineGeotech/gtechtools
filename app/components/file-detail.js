import Ember from 'ember';
const path = window.require('path');

export default Ember.Component.extend({
    exportFormat:'bln',
    fileType: '',
    filePath: '',
    pfile: '',
    savePath: '',
    dataFile: '',
    decimalPlaces: 2,
    coordSettings:'XY',
    informationNotice:'',
    exportPolygons:true,
    exportPolylines:true,
    exportPoints:true,
    isConvertPolyline:false,
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
        this.set('informationNotice','');
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
            
            this.get('exportFile').export(this.exportFormat,this.dataFile, this.savePath, this.pFile.name, this.decimalPlaces, this.isConvertPolyline,this.coordSettings, this.exportPoints,this.exportPolygons,this.exportPolylines);
            this.set('informationNotice','File exported');
        },
        selectCoord(value) {
            this.set('coordSettings', value);
     
          },
          selectOutput(value){
              this.set('exportFormat',value);
          }
    }
});
