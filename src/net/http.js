
const CHUNK_SIZE = 200*1024; // 10 KB
const TIME_OUT = 30*1000;   // 30s

const STATE = {
    STARTED: "STARTED",
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    REVOKED: "REVOKED",
    // REJECTED: "REJECTED"
};

const RESPONSE_TYPE = {
    arraybuffer: "arraybuffer",
    text       : "text"
};

/**
    record:
        {
            stime: 1482480581.177942, // second
            etime: 1482480581.177942, // second
            size : 200*1024           // Byte
        }

352 x 240 (240p) (SD) (VCD Players)
480 x 360 (360p)
858 x 480 (480p)
1280 x 720 (720p) (HD) (Some HDTVs)
1920 x 1080 (1080p) (HD) (Blu-Ray Players, HDTV)
3860 x 2160 (2160p) (Ultra-HD) (4K Players / Televisions)

Apart from these, there are other variants of resolutions as well
640 x 480 (VGA, Standard Definition TVs)
1280 x 544 (Wide-Screen movies)
1920 x 816 or 1920 x 800 (Wide-screen movies)

Range:

3840x2160p  @60fps  20000-51000 Kbps    (2160P)4K
3840x2160p  @30fps  13000-34000 Kbps    (2160P)4K
2560x1440p  @60fps  9000-18000 Kbps     1440P
2560x1440p  @30fps  6000-13000 Kbps     1440P
1920x1080p  @60fps  4500-9000 Kbps      1080P   
1920x1080p  @30fps  3000-6000 Kbps      1080P
1280x720P   @60fps  2250-6000 Kbps      720P
1280x720P   @30fps  1500-4000 Kbps      720P

854x480P    @30fps  500-2000 Kbps       480P
640x360P    @30fps  400-1000 Kbps       360P
426x240P    @30fps  300-700 Kbps        240P
256×144p    @30fps  80-320 Kbps         144P

Suggestion:

2160p   20000 kbps
1440p    8913 kbps
1080p    3774 kbps
 720p    3000 kbps
 480p    1000 kbps
 360p     721 kbps
 240p     377 kbps
 144p      80 kbps
**/

function BandwidthMonitor(){
    this.history = [];
}

BandwidthMonitor.prototype.suggestion = function (bitrate){
    if ( typeof bitrate !== 'number' ||  bitrate < 0 ) {
        throw new Error("oops ... ");
    }
    // TODO: 需要调校最佳参数
    if ( bitrate < 377 ) {
        return {"resolution": "256×144", "fps": 30};
    } else if ( bitrate < 721 ) {
        return {"resolution": "426x240", "fps": 30};
    } else if ( bitrate < 1000 ) {
        return {"resolution": "640x360", "fps": 30};
    } else if ( bitrate < 3000 ) {
        return {"resolution": "854x480", "fps": 30};
    } else if ( bitrate < 3774 ) {
        return {"resolution": "1280x720", "fps": 30};
    } else if ( bitrate < 8913 ) {
        return {"resolution": "1920x1080", "fps": 30};
    } else if ( bitrate < 20000 ) {
        return {"resolution": "3840x2160", "fps": 30};
    } else {
        return {"resolution": "3840x2160", "fps": 30};
    }
};

BandwidthMonitor.prototype.report = function (){
    let ave_num = Math.round(this.history.map(function (record){
        return Math.round(record.size / (record.etime - record.stime))
    }).reduce(function (a, b){
        return a+b;
    }, 0)/this.history.length) * 8; // Kbps
    return this.suggestion(ave_num);
};


function Event(state, result) {
    this.state  = state;
    this.result = result;
    this.request = {
        "method": "GET",
        "url"   : "",
        "body"  : ""
    };
    // this.xhr = xhr;
}

/**
    opts: {
        range  : [0, 1024],
        timeout: 1230,
        responseType: Enum("arraybuffer", "text")
    }
**/

function fetch (url, callback, opts){
    if ( !opts ) var opts = {};
    if ( !opts.timeout ) opts.timeout = TIME_OUT; // 30s
    if ( !opts.responseType ) opts.responseType = "text";
    if ( opts.responseType !== RESPONSE_TYPE.text
            && opts.responseType !== RESPONSE_TYPE.arraybuffer )
                opts.responseType = "text";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = opts.responseType;

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
            body: undefined
        };
        if ( opts.responseType === RESPONSE_TYPE.text ) {
            response.body = xhr.responseText;
        } else if ( opts.responseType === RESPONSE_TYPE.arraybuffer ) {
            response.body = new Uint8Array(xhr.response);
        } else {
            response.body = xhr.responseText;
        }
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
    var fetch_options = {
        "responseType": "arraybuffer"
    };

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
        "timeout": TIME_OUT,
        "responseType": "arraybuffer"
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