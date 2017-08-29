import Ember from 'ember';
const path = window.require('path');
const { dialog } = window.require('electron').remote;

export default Ember.Component.extend({
    exportFormat:'bln',
    fileType: '',
    filePath: '',
    pfile: '',
    savePath: '',
    dataFiles:[],
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
    outputFormats:['bln','dxf'],
    coordinateFormats:['XY','XZ','YZ'],
    exportIndex:0,

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
                dataFile.index = this.exportIndex;
                this.exportIndex++;
                dataFile.name = this.pFile.name;
                dataFile.ext = this.pFile.ext;
                dataFile.outputFormat = this.exportFormat;
                dataFile.decimalPlaces = this.decimalPlaces;
                dataFile.coordSettings = this.coordSettings;
                dataFile.exportPolygons = true;
                dataFile.exportPolylines = true;
                dataFile.exportPoints = true;
                dataFile.isConvertPolyline = false;

                this.dataFiles.addObject(dataFile);
                this.set('dataFile', dataFile);
            });

        }

    },
    actions: {
        clearFiles(){
            this.set('dataFiles',[]);
            this.set('dataFile','');
        },
        exportFile() {
            
            this.get('exportFile').export(this.dataFile, this.savePath);
         
            this.set('dataFile','');
            this.set('informationNotice','File exported');
        },
        exportFiles() {
            var self = this;
            this.get('dataFiles').forEach(function(dataFile){
                self.get('exportFile').export(dataFile, self.savePath);
            });
            this.set('dataFiles',[]);
            this.set('dataFile','');
            
            this.set('informationNotice','Files exported');
        },
        selectCoord(value) {
            this.set('coordSettings', value);
     
          },
          selectOutput(value){
              this.set('exportFormat',value);
          },
          selectCoordDataFile(value) {
            this.set('dataFile.coordSettings', value);
     
          },
          selectOutputDataFile(value){
              this.set('dataFile.outputFormat',value);
          },
          deleteDataFile(dataFile){
              
             this.set('dataFiles',this.dataFiles.filter(df=>df.index!=dataFile.index));
             this.set( 'dataFile',this.dataFiles[0]);
          
          },
          editDataFile(dataFile){
            this.set('dataFile',dataFile);
        },
        selectDir() {
            dialog.showOpenDialog({
                title: "Select a folder",                              
                properties: ["openDirectory"]
                
            }, (folderPaths) => {
                // clear out existing files
                this._super(...arguments);
               

                // folderPaths is an array that contains all the selected paths
                if (folderPaths === undefined) {
                    //console.log("No destination folder selected");
                    return;
                } else {
                    
                   
                    this.set('savePath', folderPaths[0]);
                }
            });
        }

    }
});
