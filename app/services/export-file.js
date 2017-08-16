import Ember from 'ember';
const fs = window.require('fs');
const path = window.require('path');
export default Ember.Service.extend({

    export(file,fpath,filename,decimalPlaces){
        var self = this;
        var textFile = self.createBLN(file,decimalPlaces);
        var filePath = path.join(fpath,filename+'.bln');
        fs.writeFile(filePath,textFile,(err)=>{
            if(err)throw err;
            console.log("The file ("+filePath+") was saved");
        })
    },
    createBLN(file,decimalPlaces){
        self = this;
        // Write out polygons first
        var polygons = file.polygons;
        //var csvContent = "data:text/csv;charset=utf-8,\n";
        var csvContent = '';
        polygons.forEach(function(polygon) {
            // each polygon is a collection of points
            // first and last the same
            var count = polygon.length;
            var headerString = count.toString()+",0\n";
            csvContent+=headerString;
            polygon.forEach(function(infoArray, index){
                
                   var dataString = [self.roundNumber(infoArray.x,decimalPlaces),self.roundNumber(infoArray.y,decimalPlaces)].join(",");
                   csvContent += index < polygon.length ? dataString+ "\n" : dataString;
                
                }); 


        }, this);

        // Write out polylines next
        var polylines = file.polylines;
        //var csvContent = "data:text/csv;charset=utf-8,\n";
       
        polylines.forEach(function(polyline) {
            // each polyline is a collection of points

            var count = polyline.length;
            var headerString = count.toString()+"\n";
            csvContent+=headerString;
            polyline.forEach(function(infoArray, index){
                
                   var dataString = [self.roundNumber(infoArray.x,decimalPlaces),self.roundNumber(infoArray.y,decimalPlaces)].join(",");
                   csvContent += index < polyline.length ? dataString+ "\n" : dataString;
                
                }); 


        }, this);

        // write out the points

        var points = file.points;
        points.forEach(function(point) {
                    
            var count = polyline.length;
            var headerString = "1\n";
            csvContent+=headerString;
            var dataString = [self.roundNumber(point.x,decimalPlaces),self.roundNumber(point.y,decimalPlaces)].join(",");
            csvContent += index < polyline.length ? dataString+ "\n" : dataString;
        
        }, this);

      
        return csvContent;
    },
    roundNumber(num, scale) {
        if(!("" + num).includes("e")) {
          return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        } else {
          var arr = ("" + num).split("e");
          var sig = ""
          if(+arr[1] + scale > 0) {
            sig = "+";
          }
          return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
      }

});
