import Ember from 'ember';
const Promise = Ember.RSVP.Promise;
const fs = window.require('fs');


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
        var self = this;
        self.set('dataFile', {
            points: [],
            polygons: [],
            polylines: []
        });
        var callback = (resolve, reject) => {
            fs.readFile(filePath, function (err, filedata) {
                if (err) {
                    return console.error(err);
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
       
        console.log(this.dataFile);

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
