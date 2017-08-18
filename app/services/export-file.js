import Ember from 'ember';
const fs = window.require('fs');
const path = window.require('path');
export default Ember.Service.extend({

    export(file, fpath, filename, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines) {
        var self = this;
        var textFile = self.createBLN(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines);
        var filePath = path.join(fpath, filename + '_' + coordSettings + '.bln');
        fs.writeFile(filePath, textFile, { encoding: 'utf-8' }, (err) => {
            if (err) throw err;

        })
    },
    createBLN(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines) {
        var self = this;
        // Write out polygons first
        var polygons = file.polygons;
        //var csvContent = "data:text/csv;charset=utf-8,\n";
        var csvContent = '';
        console.log(exPolygons);
        if (exPolygons) {
            polygons.forEach(function (polygon) {
                // each polygon is a collection of points
                // first and last the same
                var count = polygon.length;
                var headerString = count.toString() + ",0\n";
                csvContent += headerString;
                polygon.forEach(function (infoArray, index) {
                    var dataString = '';
                    switch (coordSettings) {
                        case 'XY':
                            dataString = [self.roundNumber(infoArray.x, decimalPlaces), self.roundNumber(infoArray.y, decimalPlaces)].join(",");
                            break;
                        case 'XZ':
                            dataString = [self.roundNumber(infoArray.x, decimalPlaces), self.roundNumber(infoArray.z, decimalPlaces)].join(",");
                            break;
                        case 'YZ':
                            dataString = [self.roundNumber(infoArray.y, decimalPlaces), self.roundNumber(infoArray.z, decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += index < polygon.length ? dataString + "\n" : dataString;

                });


            }, this);
        }
        if (exPolylines) {
            // Write out polylines next
            var polylines = file.polylines;
            //var csvContent = "data:text/csv;charset=utf-8,\n";

            polylines.forEach(function (polyline) {
                // each polyline is a collection of points

                var count = polyline.length;
                if (convertPolylines) count++;
                var headerString = count.toString() + "\n";
                csvContent += headerString;
                polyline.forEach(function (infoArray, index) {
                    var dataString = '';
                    switch (coordSettings) {
                        case 'XY':

                            dataString = [self.roundNumber(infoArray.x, decimalPlaces), self.roundNumber(infoArray.y, decimalPlaces)].join(",");
                            break;
                        case 'XZ':

                            dataString = [self.roundNumber(infoArray.x, decimalPlaces), self.roundNumber(infoArray.z, decimalPlaces)].join(",");
                            break;
                        case 'YZ':

                            dataString = [self.roundNumber(infoArray.y, decimalPlaces), self.roundNumber(infoArray.z, decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += index < polyline.length ? dataString + "\n" : dataString;

                });
                if (convertPolylines) {
                    // convert polyline to polygon by duplicateing the last point
                    var dataString = '';
                    switch (coordSettings) {
                        case 'XY':
                            dataString = [self.roundNumber(polyline[0].x, decimalPlaces), self.roundNumber(polyline[0].y, decimalPlaces)].join(",");
                            break;
                        case 'XZ':
                            dataString = [self.roundNumber(polyline[0].x, decimalPlaces), self.roundNumber(polyline[0].z, decimalPlaces)].join(",");
                            break;
                        case 'YZ':
                            dataString = [self.roundNumber(polyline[0].y, decimalPlaces), self.roundNumber(polyline[0].z, decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += dataString + "\n";

                }

            }, this);
        }
        if (exPoints) {
            // write out the points

            var points = file.points;
            points.forEach(function (point) {


                var headerString = "1\n";
                csvContent += headerString;
                var dataString = '';
                switch (coordSettings) {
                    case 'XY':
                        dataString = [self.roundNumber(point.x, decimalPlaces), self.roundNumber(point.y, decimalPlaces)].join(",");
                        break;
                    case 'XZ':
                        dataString = [self.roundNumber(point.x, decimalPlaces), self.roundNumber(point.z, decimalPlaces)].join(",");
                        break;
                    case 'YZ':
                        dataString = [self.roundNumber(point.y, decimalPlaces), self.roundNumber(point.z, decimalPlaces)].join(",");
                        break;
                }

                csvContent += dataString + "\n";

            }, this);
        }

        return csvContent;
    },
    roundNumber(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale) + "e-" + scale);
        } else {
            var arr = ("" + num).split("e");
            var sig = ""
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    }

});
