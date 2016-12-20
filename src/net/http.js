
const CHUNK_SIZE = 10*1024; // 10 KB
const TIME_OUT = 30*1000;   // 30s
const STATE = {
    STARTED: "STARTED",
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    REVOKED: "REVOKED",
    // REJECTED: "REJECTED"
};

/**
    opts: {
        range  : [0, 1024],
        timeout: 1230,
        
    }
**/
function fetch (url, callback, opts){
    if ( !opts ) var opts = {};
    if ( !opts.timeout ) opts.timeout = TIME_OUT; // 30s

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    if ( opts.range && opts.range instanceof Array && opts.range.length === 2 ) {
        xhr.setRequestHeader('Range', 'bytes='+opts.range.join("-"));
    }
    
    xhr.onprogress = function (e){
        callback(STATE.PENDING, {"loaded": e.loaded, "total": e.total} );
    };
    xhr.onload = function(e) {
        var headers = xhr.getAllResponseHeaders()
                        .replace("\r\n", "\n")
                        .split("\n")
                        .reduce(function (a, b){
                            var kv = b.split(":");
                            if ( kv.length >= 2 ) {
                                var k = kv[0].trim().toLowerCase();
                                var v = kv.slice(1).join(":").trim();
                                if ( k.length > 0 ) a[k] = v;
                            }
                            return a;
                        }, {});
        var response = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: headers,
            body: new Uint8Array(xhr.response)
        };
        callback(STATE.SUCCESS, response);
    };
    xhr.onerror = function (e){
        callback(STATE.FAILURE);
    };
    xhr.onabort = function (e){
        callback(STATE.REVOKED);
    };

    // IE problem.
    /**
        window.setTimeout(function (){
            xhr.abort();
        }, 30*1000);
    **/
    xhr.ontimeout = function (e){
        xhr.abort();
    };
    xhr.send();
    callback(STATE.STARTED);
}

// Uint8Array to blob file:
// var file = new Blob([Uint8Array], {type: mimeType});

function test_fetch_with_no_fragments(){
    var fetch_options = null;
    var onFetchDone = function (httpResponse){
        console.log("Fetch DONE.");
        console.log(httpResponse.body);
    };
    fetch(url, function (state, data){
        if ( state === 'SUCCESS' ){
            onFetchDone(data);
        } else if ( state === 'FAILURE' || state === 'REVOKED' ) {
            console.warn("fetch  file fail.");
        }
    }, fetch_options);
}

function test_fetch_with_fragments(){
    var url = "/assets/video/test.mp4";

    var chunkSize = CHUNK_SIZE;
    var bufferSize = 0;
    var totalSize = 0;
    var chunks = [];

    var fetch_options = {
        "range": [bufferSize, chunkSize-1],
        "timeout": TIME_OUT
    };

    var onFetchDone = function (httpResponse){
        totalSize = parseInt(httpResponse.headers['content-range'].split("/")[1]);
        var contentLength = parseInt(httpResponse.headers['content-length']);
        bufferSize = bufferSize + contentLength;

        if ( bufferSize === totalSize ){
            console.log("Fetch DONE.");
            console.log(chunks);
        } else if ( bufferSize < totalSize ) {
            fetch_options.range = [bufferSize, bufferSize+chunkSize-1];
            download_fragment();
        } else {
            // 代码不应该执行到这里，如果执行了，意味着 ....
            console.error("Ooops ...");
        }
        chunks.push(httpResponse.body);
    };
    var download_fragment = function (){
        fetch(url, function (state, data){
            if ( state === 'SUCCESS' ){
                onFetchDone(data);
            } else if ( state === 'FAILURE' || state === 'REVOKED' ) {
                console.warn("fetch  file fail.");
            }
        }, fetch_options);
    };
    download_fragment();
}

function test(){
    test_with_no_fragments();
    test_with_fragments();
}

export default {fetch, STATE};