

window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
    window.alert('MediaSource API is not available');
}


/**

    var cb = function (chunk){
        // do something....
    };
    range_request("/path/to/video.mp4", [0, 500], cb)
    range_request("/path/to/video.webm", [0, 500], cb)
    range_request("/path/to/video.flv", [0, 500], cb)
**/
function range_request(url, range, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Range', 'bytes='+range.join("-"));
    xhr.onload = function(e) {
        var chunk = new Uint8Array(e.target.result);
        callback(chunk);
    }
    xhr.send();
}


/**
    var video = document.querySelector('video');
    var mediaSource = new MediaSource();
    video.src = window.URL.createObjectURL(mediaSource); // blob URL pointing to the MediaSource.
    
    var sourceBuffer = null;

    var cb = function (chunks){
        // do something ...
        chunks.forEach(function (chunk, i){
            var reader = new FileReader();
            reader.onload = function(e) {
                // Append Media Chunk TO sourceBuffer
                sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
                logger.log('appending chunk:' + i);
                if (i == chunks.length - 1) {
                    mediaSource.endOfStream();
                } else {
                    if ( video.paused ) {
                        video.play();
                    }
                }
            };
            reader.readAsArrayBuffer(chunk);
        });
    };
    
    var onSourceOpen = function (){
        // Init sourceBuffer
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
        // Fetch Media Binary data.
        slice_blob_file("/path/video.mp4", cb)
    };
    mediaSource.addEventListener('sourceopen', onSourceOpen, false);
    mediaSource.addEventListener('webkitsourceopen', onSourceOpen, false);

    mediaSource.addEventListener('webkitsourceended', function(e) {
        console.log('mediaSource readyState: ' + this.readyState);
    }, false);
**/

function media_request(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    var NUM_CHUNKS = 5;
    var slice_blob_file = function (blob_file){
        var chunkSize = Math.ceil(blob_file.size / NUM_CHUNKS);
        var chunks = [...Array(NUM_CHUNKS).keys()].map(function (i){
            var startByte = chunkSize * i;
            var chunk = blob_file.slice(startByte, startByte + chunkSize, blob_file.type);
            return window.URL.createObjectURL(chunk);
        });
        callback(chunks);
    };
    xhr.onload = function(e) {
        if (this.status == 200) {
            slice_blob_file(this.response);
        }
    };
    xhr.send();
}



/***

load playlist:
    loader("http://www.example.com/video.mpd")
    loader("http://www.example.com/video.m3u")
    loader("http://www.example.com/video.m3u8")
    loader("http://www.example.com/video.xspf")

load binary data:
    loader("http://www.example.com/video.mp4")
    loader("http://www.example.com/video.webm")
    loader("http://www.example.com/video.ts")
    loader("http://www.example.com/video.flv")

**/
function loader (url){

}

export default {loader};