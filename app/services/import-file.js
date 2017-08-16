import Ember from 'ember';
const Promise = Ember.RSVP.Promise;
const fs = window.require('fs');
const path = window.require('path');
const DxfParser = window.require('dxf-parser');

export default Ember.Service.extend({
    dataFile: null,
    init() {
        this.set('dataFile', {
            points: [],
            polygons: [],
            polylines: []
        });
    },

    import(filePath) {
       
        var callback = (resolve) => {
            var self = this;
            self.set('dataFile', {
                points: [],
                polygons: [],
                polylines: []
            });
            var fpath = path.parse(filePath);
           
            switch (fpath.ext) {
                case '.str':
                    return this.importSurpacStr(filePath).then((df)=>{
                    resolve(df);
                    return df;
                    })
                  
                    
                case '.csv':
                return this.importDatamineCSV(filePath).then((df)=>{
                    resolve(df);
                    return df;
                    })
                    break;
                case '.dxf':
                return this.importSurpacDXF(filePath).then((df)=>{
                    resolve(df);
                    return df;
                    })


                    break;

                default:

            }
            
        }
        return new Promise(callback);
    },
    importDatamineCSV(filePath){
        var callback = (resolve) => {
            var self = this;
            fs.readFile(filePath, function (err, filedata) {
                if (err) {
                    throw err;
                }
                var csv = filedata.toString();
                var allTextLines = csv.split(/\r\n|\n/);
                var lines = [];
                for (var i = 0; i < allTextLines.length; i++) {
                    var data = allTextLines[i].split(',');
                    var tarr = [];
                    for (var j = 0; j < data.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
    
                }
              
                var points = [];
                const xColumn = 0;
                const yColumn = 1;
                const zColumn = 2;
                const oColumn = 3;
                const pColumn = 4;
                var pvalue = lines[1][pColumn];
                for (var l = 1; l < lines.length; l++) {
                    if (pvalue==lines[l][pColumn]) {
                        points.push(
                            {
                                x: Number(lines[l][xColumn]),
                                y: Number(lines[l][yColumn]),
                                z: Number(lines[l][zColumn]),
                                sOrder:Number(lines[l][oColumn])
                            });
                       
                    } else {
                        self.addpoly(points);
                        pvalue = lines[l][pColumn]; 
                        points = [];
                       
                    }
                }
        
                resolve(self.dataFile);
                return self.dataFile;
    
            })
        }
        return new Promise(callback);
    },
    importSurpacDXF(filePath){
        var callback = (resolve) => {
            var self = this;
            fs.readFile(filePath, function (err, filedata) {
                if (err) {
                    throw err;
                }
                var fileText = filedata.toString();


                var parser = new DxfParser();
                try {
                    var dxf = parser.parseSync(fileText);
                    console.log(dxf);

                    dxf.entities.forEach(function(entity) {
                        self.addpoly(entity.vertices);
                        
                        
                    }, this);    


                }catch(err) {
                    return console.error(err.stack);
                }




                console.log(self.dataFile);

                resolve(self.dataFile);
                return self.dataFile;
    
            })
        }
        return new Promise(callback);
    }


    ,

    importSurpacStr(filePath) {
        var callback = (resolve) => {
        var self = this;
        fs.readFile(filePath, function (err, filedata) {
            if (err) {
                throw err;
            }
            var csv = filedata.toString();
            var allTextLines = csv.split(/\r\n|\n/);
            var lines = [];
            for (var i = 0; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                var tarr = [];
                for (var j = 0; j < data.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);

            }
            var points = [];
            var sOrder = 1;
            const xColumn = 1;
            const yColumn = 2;
            const zColumn = 3;

            for (var l = 0; l < lines.length; l++) {
                if (!isNaN(Number(lines[l][0])) && Number(lines[l][0]) > 0) {
                    points.push(
                        {
                            x: Number(lines[l][xColumn]),
                            y: Number(lines[l][yColumn]),
                            z: Number(lines[l][zColumn]),
                            sOrder
                        });
                    sOrder++;
                } else {
                    self.addpoly(points);
                    points = [];
                    sOrder = 1;
                }
            }
            resolve(self.dataFile);
            return self.dataFile;

        })
    }
    return new Promise(callback);

    },
    addpoly(points) {
        // Check the number of points
        const count = points.length;

        // Check that there is enough points here for a line or polygon
        if (count <= 1) {
            if (count == 1) {
                // this is a point add it to the points
                this.addpoint(points[0]);

            }
            // there are no points. exit function
            return;

        }

        // Determine if this is a polygon or polyline

        if (this.checkSameXYZ(points[0], points[points.length - 1])) {
            // Polygon


            this.dataFile.polygons.push(points);

        } else {
            // Polyline
            this.dataFile.polylines.push(points);
        }
    },
    addpoint(point) {
        //TODO: Add some validation code

        this.dataFile.points.push(point);
    },
    checkSameXYZ(p1, p2) {

        if (p1.x === p2.x && p1.y === p2.y && p1.z === p2.z) {
            return true;
        }

        return false;

    }

});
