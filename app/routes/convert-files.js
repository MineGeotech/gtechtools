import Ember from 'ember';

export default Ember.Route.extend({
  
  model() {
    // const filePath = params.file_path === 'root' ? window.process.env['HOME'] : params.file_path;
    // let sideBarDirectory = this.get('readDirectory').path();
    let currentFile = '';

    return Ember.RSVP.hash({
      currentFile
      
    });
  }
});