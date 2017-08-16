import Ember from 'ember';
const fs = window.require('fs');
const path = window.require('path');
export default Ember.Service.extend({

    export(file,fpath,filename){
        var self = this;
        var textFile = self.createBLN(file);
        var filePath = path.join(fpath,filename+'.bln');
        fs.writeFile(filePath,textFile,(err)=>{
            if(err)throw err;
            console.log("The file ("+filePath+") was saved");
        })
    },
    createBLN(file){
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
                
                   var dataString = [infoArray.x,infoArray.y].join(",");
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
                
                   var dataString = [infoArray.x,infoArray.y].join(",");
                   csvContent += index < polyline.length ? dataString+ "\n" : dataString;
                
                }); 


        }, this);

        // write out the points

        var points = file.points;
        points.forEach(function(point) {
                    
            var count = polyline.length;
            var headerString = "1\n";
            csvContent+=headerString;
            var dataString = [point.x,point.y].join(",");
            csvContent += index < polyline.length ? dataString+ "\n" : dataString;
        
        }, this);

      
        return csvContent;
    }

});
