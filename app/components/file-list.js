import Ember from 'ember';
const { dialog } = window.require('electron').remote;
const path = window.require('path');

export default Ember.Component.extend({
    fileList: null,
    
    
    readDirectory: Ember.inject.service(),
   
    init() {
        this._super(...arguments);
        this.set('fileList', []);
        this.readDir(null);
    },
    actions: {
        openFile(file) {
            //shell.openItem(file);
            var self = this;
            Ember.set(self.model,'currentFile', file);
         
            },
        openDir(file) {
            this.readDir(file);
        },
        selectDir() {
            dialog.showSaveDialog({
                title: "Select a folder",
                properties: ["openDirectory"]
            }, (folderPaths) => {
                // clear out existing files
                this._super(...arguments);
                this.set('fileList', []);

                // folderPaths is an array that contains all the selected paths
                if (folderPaths === undefined) {
                    //console.log("No destination folder selected");
                    return;
                } else {
                    let parsedPath = path.parse(folderPaths);
                    
                    this.readDir(parsedPath.dir);

                }
            });
        }

    }
    ,
    readDir(path) {
        this._super(...arguments);
        this.set('fileList', []);
        if (path == null) {
            this.get('readDirectory').path().then(files => {

                this.get('fileList').addObjects(files);
            });
        } else {
            this.get('readDirectory').path(path).then(files => {

                this.get('fileList').addObjects(files);
            });
        }
    }
}
);