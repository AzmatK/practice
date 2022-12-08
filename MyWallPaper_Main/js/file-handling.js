
/****** Handle files here ******/

function handle_file_select(e, callback) {
  // Select file
  var file = e.target.files[0];

 // Only process image files.
  if (!file.type.match('image.*')) {
    alert("Error: Only image files are allowed on Wallpaper!")
    return;
  }

  var reader = new FileReader();

  // Capture the file information.
  reader.onload =  function(e) {
    callback && callback(file.name, e.target.result);
  };

  // Read in the image file as a data URL.
  reader.readAsDataURL(file);
}

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var array = []
    for(var i = 0; i < byteString.length; i++) {
        array.push(byteString.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mimeString});
}

function save_file(filename, dataURI, callback) {
  save_file_blob(filename, dataURItoBlob(dataURI), callback);
}

function save_file_blob(filename, blob, callback) {
  fs.root.getFile(filename, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function(e) {
        callback && callback(fileEntry.toURL());
      };
      fileWriter.write(blob);
    }, error_handler);
  }, error_handler);
}

var list_files = function(callback) {
  var entries = [];
  var reader = fs.root.createReader();
  function read_entries() {
    reader.readEntries(function (results) {
      if (!results.length) {
        callback(entries.sort());
      } else {
        entries = entries.concat(toArray(results));
        read_entries();
      }
    }, error_handler);
  }
  read_entries();
}

function error_handler(e) {
  console.log(e);
}

// initialise file system
var fs;
function on_init_file_system(filesystem) { fs = filesystem; }
window.requestFileSystem || (window.requestFileSystem = window.webkitRequestFileSystem);
window.requestFileSystem(window.PERSISTENT, 50*1024*1024, on_init_file_system, error_handler);
