import Ember from 'ember';
const fs = window.require('fs');
const path = window.require('path');

export default Ember.Service.extend({

    export(file, fpath) {
        var self = this;
        switch(file.outputFormat){
            case 'bln':
        var textFile = self.createBLN(file);
        var filePath = path.join(fpath, file.name + '_' + file.coordSettings + '.bln');
        fs.writeFile(filePath, textFile, { encoding: 'utf-8' }, (err) => {
            if (err) throw err;

        })
        break;
        case 'dxf':
            var textFile2 = this.createDXF(file);
            var filePath2 = path.join(fpath, file.name + '_' + file.coordSettings + '.dxf');
            fs.writeFile(filePath2, textFile2, { encoding: 'utf-8' }, (err) => {
                if (err) throw err;
    
            })
        break;
    }
    },
    createDXF(file){

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

        if (file.exportPolygons) {
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

              
                polygon.forEach(function (infoArray) {
                    
                    csvContent += 'VERTEX' + "\n";
                    csvContent += '8' + "\n";
                    csvContent += '0' + "\n";
                    

                    switch (file.coordSettings) {
                        case 'XY':
                            
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.x, file.decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.y, file.decimalPlaces) + "\n";
                            csvContent += '30' + "\n";
                            csvContent += '0' + "\n";
                            csvContent += '70' + "\n";
                            csvContent += '32' + "\n";
                            csvContent += '0' + "\n";
                           break;
                        case 'XZ':
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.x, file.decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.z, file.decimalPlaces) + "\n";
                            csvContent += '30' + "\n";
                            csvContent += '0' + "\n";
                            csvContent += '70' + "\n";
                            csvContent += '32' + "\n";
                            csvContent += '0' + "\n";
                          break;
                        case 'YZ':
                            csvContent += '10' + "\n";
                            csvContent += self.roundNumber(infoArray.Y, file.decimalPlaces).toString() + "\n";
                            csvContent += '20' + "\n";
                            csvContent += self.roundNumber(infoArray.z, file.decimalPlaces) + "\n";
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
        if (file.exportPolylines) {
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

                polyline.forEach(function (infoArray) {
                    csvContent += 'VERTEX' + "\n";
                    csvContent += '8' + "\n";
                    csvContent += '0' + "\n";
                    switch (file.coordSettings) {
                        case 'XY':
                        
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.y, file.decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    case 'XZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.x, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, file.decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                      break;
                    case 'YZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(infoArray.Y, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(infoArray.z, file.decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    }

                    

                });
                if (file.isConvertPolyline) {
                    // convert polyline to polygon by duplicateing the last point
                    
                    switch (file.coordSettings) {
                        case 'XY':
                        
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(polyline[0].x, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(polyline[0].y, file.decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                       break;
                    case 'XZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(polyline[0].x, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(polyline[0].z, file.decimalPlaces) + "\n";
                        csvContent += '30' + "\n";
                        csvContent += '0' + "\n";
                        csvContent += '70' + "\n";
                        csvContent += '32' + "\n";
                        csvContent += '0' + "\n";
                      break;
                    case 'YZ':
                        csvContent += '10' + "\n";
                        csvContent += self.roundNumber(polyline[0].Y, file.decimalPlaces).toString() + "\n";
                        csvContent += '20' + "\n";
                        csvContent += self.roundNumber(polyline[0].z, file.decimalPlaces) + "\n";
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
        if (file.exportPoints) {
            // write out the points

            var points = file.points;
            points.forEach(function (point) {


                csvContent += 'POINT' + "\n";
                csvContent += '8' + "\n";
                csvContent += '0' + "\n";
                csvContent += '100' + "\n";
                csvContent += 'AcDbPoint' + "\n";  
                if(point.color!=null){
                    csvContent += '420' + "\n";
                    csvContent += point.color + "\n"; 
                }        
                csvContent += '0' + "\n";
                switch (file.coordSettings) {
                    case 'XY':
                    
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(point.x, file.decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(point.y, file.decimalPlaces) + "\n";
                    csvContent += '30' + "\n";
                    csvContent += '0' + "\n";
                    csvContent += '70' + "\n";
                    csvContent += '32' + "\n";
                    csvContent += '0' + "\n";
                   break;
                case 'XZ':
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(point.x, file.decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(point.z, file.decimalPlaces) + "\n";
                    csvContent += '30' + "\n";
                    csvContent += '0' + "\n";
                    csvContent += '70' + "\n";
                    csvContent += '32' + "\n";
                    csvContent += '0' + "\n";
                  break;
                case 'YZ':
                    csvContent += '10' + "\n";
                    csvContent += self.roundNumber(point.Y, file.decimalPlaces).toString() + "\n";
                    csvContent += '20' + "\n";
                    csvContent += self.roundNumber(point.z, file.decimalPlaces) + "\n";
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
    createBLN(file) {
        var self = this;
        // Write out polygons first
        var polygons = file.polygons;
        //var csvContent = "data:text/csv;charset=utf-8,\n";
        var csvContent = '';
       
        if (file.exportPolygons) {
            polygons.forEach(function (polygon) {
                // each polygon is a collection of points
                // first and last the same
                var count = polygon.length;
                var headerString = count.toString() + ",0\n";
                csvContent += headerString;
                polygon.forEach(function (infoArray, index) {
                    var dataString = '';
                    switch (file.coordSettings) {
                        case 'XY':
                            dataString = [self.roundNumber(infoArray.x, file.decimalPlaces), self.roundNumber(infoArray.y, file.decimalPlaces)].join(",");
                            break;
                        case 'XZ':
                            dataString = [self.roundNumber(infoArray.x, file.decimalPlaces), self.roundNumber(infoArray.z, file.decimalPlaces)].join(",");
                            break;
                        case 'YZ':
                            dataString = [self.roundNumber(infoArray.y, file.decimalPlaces), self.roundNumber(infoArray.z, file.decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += index < polygon.length ? dataString + "\n" : dataString;

                });


            }, this);
        }
        if (file.exportPolylines) {
            // Write out polylines next
            var polylines = file.polylines;
            //var csvContent = "data:text/csv;charset=utf-8,\n";

            polylines.forEach(function (polyline) {
                // each polyline is a collection of points

                var count = polyline.length;
                if (file.isConvertPolyline) count++;
                var headerString = count.toString() + "\n";
                csvContent += headerString;
                polyline.forEach(function (infoArray, index) {
                    var dataString = '';
                    switch (file.coordSettings) {
                        case 'XY':

                            dataString = [self.roundNumber(infoArray.x, file.decimalPlaces), self.roundNumber(infoArray.y, file.decimalPlaces)].join(",");
                            break;
                        case 'XZ':

                            dataString = [self.roundNumber(infoArray.x, file.decimalPlaces), self.roundNumber(infoArray.z, file.decimalPlaces)].join(",");
                            break;
                        case 'YZ':

                            dataString = [self.roundNumber(infoArray.y, file.decimalPlaces), self.roundNumber(infoArray.z, file.decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += index < polyline.length ? dataString + "\n" : dataString;

                });
                if (file.isConvertPolyline) {
                    // convert polyline to polygon by duplicateing the last point
                    var dataString = '';
                    switch (file.coordSettings) {
                        case 'XY':
                            dataString = [self.roundNumber(polyline[0].x, file.decimalPlaces), self.roundNumber(polyline[0].y, file.decimalPlaces)].join(",");
                            break;
                        case 'XZ':
                            dataString = [self.roundNumber(polyline[0].x, file.decimalPlaces), self.roundNumber(polyline[0].z, file.decimalPlaces)].join(",");
                            break;
                        case 'YZ':
                            dataString = [self.roundNumber(polyline[0].y, file.decimalPlaces), self.roundNumber(polyline[0].z, file.decimalPlaces)].join(",");
                            break;
                    }

                    csvContent += dataString + "\n";

                }

            }, this);
        }
        if (file.exportPoints) {
            // write out the points

            var points = file.points;
            points.forEach(function (point) {


                var headerString = "1\n";
                csvContent += headerString;
                var dataString = '';
                switch (file.coordSettings) {
                    case 'XY':
                        dataString = [self.roundNumber(point.x, file.decimalPlaces), self.roundNumber(point.y, file.decimalPlaces)].join(",");
                        break;
                    case 'XZ':
                        dataString = [self.roundNumber(point.x, file.decimalPlaces), self.roundNumber(point.z, file.decimalPlaces)].join(",");
                        break;
                    case 'YZ':
                        dataString = [self.roundNumber(point.y, file.decimalPlaces), self.roundNumber(point.z, file.decimalPlaces)].join(",");
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
