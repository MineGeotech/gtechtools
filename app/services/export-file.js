import Ember from 'ember';
const fs = window.require('fs');
const path = window.require('path');

export default Ember.Service.extend({

    export(format,file, fpath, filename, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines) {
        var self = this;
        switch(format){
            case 'bln':
        var textFile = self.createBLN(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines);
        var filePath = path.join(fpath, filename + '_' + coordSettings + '.bln');
        fs.writeFile(filePath, textFile, { encoding: 'utf-8' }, (err) => {
            if (err) throw err;

        })
        break;
        case 'dxf':
            var textFile = this.createDXF(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines);
            var filePath = path.join(fpath, filename + '_' + coordSettings + '.dxf');
            fs.writeFile(filePath, textFile, { encoding: 'utf-8' }, (err) => {
                if (err) throw err;
    
            })
        break;
    }
    },
    createDXF(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines){

        // See DXF reference for dxf codes
        // http://images.autodesk.com/adsk/files/autocad_2012_pdf_dxf-reference_enu.pdf

        var self = this;
        // Write out polygons first
        var polygons = file.polygons;
        
        
        var csvContent = '';

        // write out the header information

        csvContent += '999' + "\n";
        csvContent += 'DXF Polyline converted for Surfer' + "\n";
        csvContent += '0' + "\n";
        csvContent += 'SECTION' + "\n";
        csvContent += '2' + "\n";
        csvContent += 'ENTITIES' + "\n";
        csvContent += '0' + "\n";

        if (exPolygons) {
            polygons.forEach(function (polygon) {
                // each polygon is a collection of points
                // first and last the same

                
                csvContent += 'POLYLINE' + "\n";
                csvContent += '8' + "\n";
                csvContent += '0' + "\n";
                csvContent += '100' + "\n";
                csvContent += 'AcDb3dPolyline' + "\n";  

                if(polygon.color!=null){
                    csvContent += '420' + "\n";
                    csvContent += polygon.color + "\n"; 
                }

                csvContent += '66' + "\n"; //Obsolete; formerly an “entities follow flag” (optional; ignore if present)
                csvContent += '1' + "\n";
                csvContent += '70' + "\n"; //Polyline Flag  
                csvContent += '8' + "\n"; //8 this is a 3D polyline
                csvContent += '0' + "\n";

              
                polygon.forEach(function (infoArray, index) {
                    
                    csvContent += 'VERTEX' + "\n";
                    csvContent += '8' + "\n";
                    csvContent += '0' + "\n";
                    

                    switch (coordSettings) {
                        case 'XY':
                            
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.y, decimalPlaces) + "\n";
                            csvContent += '30' + "\n";
                            csvContent += '0' + "\n";
                            csvContent += '70' + "\n";
                            csvContent += '32' + "\n";
                            csvContent += '0' + "\n";
                           break;
                        case 'XZ':
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                            csvContent += '30' + "\n";
                            csvContent += '0' + "\n";
                            csvContent += '70' + "\n";
                            csvContent += '32' + "\n";
                            csvContent += '0' + "\n";
                          break;
                        case 'YZ':
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.Y, decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                            csvContent += '30' + "\n";
                            csvContent += '0' + "\n";
                            csvContent += '70' + "\n";
                            csvContent += '32' + "\n";
                            csvContent += '0' + "\n";
                           break;
                    }

                    

                });
                csvContent += 'SEQEND' + "\n";
                csvContent += '0' + "\n";


            }, this);

        }
        if (exPolylines) {
            // Write out polylines next
            var polylines = file.polylines;
            //var csvContent = "data:text/csv;charset=utf-8,\n";

            polylines.forEach(function (polyline) {
                // each polyline is a collection of points

                csvContent += 'POLYLINE' + "\n";
                csvContent += '8' + "\n";
                csvContent += '0' + "\n";
                csvContent += '100' + "\n";
                csvContent += 'AcDb3dPolyline' + "\n";   
                if(polyline.color!=null){
                    csvContent += '420' + "\n";
                    csvContent += polyline.color + "\n"; 
                }
                csvContent += '66' + "\n";
                csvContent += '1' + "\n";
                csvContent += '70' + "\n";
                csvContent += '8' + "\n";
                csvContent += '0' + "\n";

                polyline.forEach(function (infoArray, index) {
                    csvContent += 'VERTEX' + "\n";
                    csvContent += '8' + "\n";
                    csvContent += '0' + "\n";
                    switch (coordSettings) {
                        case 'XY':
                        
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.y, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    case 'XZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                      break;
                    case 'YZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.Y, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    }

                    

                });
                if (convertPolylines) {
                    // convert polyline to polygon by duplicateing the last point
                    
                    switch (coordSettings) {
                        case 'XY':
                        
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.y, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    case 'XZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                      break;
                    case 'YZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.Y, decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    }

                   

                }
                csvContent += 'SEQEND' + "\n";
                csvContent += '0' + "\n";

            }, this);
        }
        if (exPoints) {
            // write out the points

            var points = file.points;
            points.forEach(function (point) {


                csvContent += 'POINT' + "\n";
                csvContent += '8' + "\n";
                csvContent += '0' + "\n";
                csvContent += '100' + "\n";
                csvContent += 'AcDbPoint' + "\n";  
                if(polyline.point!=null){
                    csvContent += '420' + "\n";
                    csvContent += polyline.point + "\n"; 
                }        
                csvContent += '0' + "\n";
                switch (coordSettings) {
                    case 'XY':
                    
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(infoArray.y, decimalPlaces) + "\n";
                    csvContent += '30' + "\n";
                    csvContent += '0' + "\n";
                    csvContent += '70' + "\n";
                    csvContent += '32' + "\n";
                    csvContent += '0' + "\n";
                   break;
                case 'XZ':
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(infoArray.x, decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                    csvContent += '30' + "\n";
                    csvContent += '0' + "\n";
                    csvContent += '70' + "\n";
                    csvContent += '32' + "\n";
                    csvContent += '0' + "\n";
                  break;
                case 'YZ':
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(infoArray.Y, decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(infoArray.z, decimalPlaces) + "\n";
                    csvContent += '30' + "\n";
                    csvContent += '0' + "\n";
                    csvContent += '70' + "\n";
                    csvContent += '32' + "\n";
                    csvContent += '0' + "\n";
                   break;
                }

                csvContent += 'SEQEND' + "\n";
                csvContent += '0' + "\n";

            }, this);
        }

        csvContent += 'ENDSEC' + "\n";
        csvContent += '0' + "\n";
        csvContent += 'EOF' + "\n";

        return csvContent;
        
     
        

    },
    createBLN(file, decimalPlaces, convertPolylines, coordSettings, exPoints, exPolygons, exPolylines) {
        var self = this;
        // Write out polygons first
        var polygons = file.polygons;
        //var csvContent = "data:text/csv;charset=utf-8,\n";
        var csvContent = '';
       
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
