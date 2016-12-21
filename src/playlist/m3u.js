
/**
https://en.wikipedia.org/wiki/M3U
https://tools.ietf.org/html/draft-pantos-http-live-streaming-17#section-4
**/

import Http from '../net/http.js';

/**
#EXTM3U
#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=200000
gear1/prog_index.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=311111
gear2/prog_index.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=484444
gear3/prog_index.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=737777
gear4/prog_index.m3u8


#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10, no desc
fileSequence0.ts
#EXTINF:10, no desc
fileSequence1.ts
#EXTINF:10, no desc
fileSequence2.ts
#EXTINF:10, no desc
#EXT-X-ENDLIST

#EXT-X-BYTERANGE:0@1024
fileSequence2.ts

#EXT-X-MEDIA-SEQUENCE:<number>
#EXT-X-PLAYLIST-TYPE:<EVENT|VOD>
#EXT-X-ENDLIST

**/
const MASTER_PLAYLIST_REGEX = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
const MASTER_PLAYLIST_MEDIA_REGEX = /#EXT-X-MEDIA:(.*)/g;
const LEVEL_PLAYLIST_REGEX_FAST = /#EXTINF: *([^,]+),?(.*)|(?!#)(\S.+)|#EXT-X-BYTERANGE: *(.+)|#EXT-X-PROGRAM-DATE-TIME:(.+)|#.*/g;
const LEVEL_PLAYLIST_REGEX_SLOW = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;

function arrayBufferToString(arrayBuffer){
    return Array.prototype.map.call(arrayBuffer, function (code){
        return String.fromCharCode(code);
    }).join("");
}

function getBaseUrl(url){
    try{
        let _url = new window.URL(url);
        let pathname = _url.pathname.split("/");
        pathname.splice(-1, 1);
        return _url.origin + pathname.join("/");
    }catch(e){
        let pathname = url.split("/");
        pathname.splice(-1, 1);
        return pathname.join("/");
    }
}

function urljoin(a, b){
    return a + "/" + b;
}

function load(url, callback){
    // var url = new window.URL(url);
    var onFetch = function (state, data){
        if ( state === Http.STATE.SUCCESS ) {
            callback(data);
        } else if ( state === Http.STATE.FAILURE || state === Http.STATE.REVOKED ) {
            console.log("m3u8 playlist fetch fail.");
        }
    };
    Http.fetch(url, onFetch, null);
}
/**
    {
        "type": Enum("LIVE", "VOD"),
        "duration": Option<Number>,
        "segments": [
            {
                "duration": Option<Number>,
                "sequence": Option<Number>,
                "location": URL,
                "byterange": Option<Vec<Number>>,
                ""
            }
        ]
    }


**/

const TAGS = [
    // Basic
    "EXTM3U", "EXTINF",
    // New Tag
    "EXT-X-BYTERANGE", "EXT-X-TARGETDURATION", "EXT-X-MEDIA-SEQUENCE", "EXT-X-KEY",
    "EXT-X-PROGRAM-DATE-TIME", "EXT-X-ALLOW-CACHE", "EXT-X-PLAYLIST-TYPE", "EXT-X-ENDLIST",
    "EXT-X-MEDIA", "EXT-X-STREAM-INF", "EXT-X-DISCONTINUITY", "EXT-X-I-FRAMES-ONLY",
    "EXT-X-I-FRAME-STREAM-INF", "EXT-X-VERSION"
];


function parseLine(line){
    if ( line.startsWith("#EXTM3U") ){
        return null;
    } else if ( line.startsWith("#EXTINF") ) {
        // #EXTINF:10, no desc, file.ts
        let kv = line.split(":")[1].split(",");
        let duration = parseFloat(kv[0]);
        let title = kv[1].trim();
        let url = kv[2].trim();
        return {
            "EXTINF": {
                "duration": duration,
                "title": title,
                "url"  : url
            }
        };
    } else if ( line.startsWith("#EXT-X-BYTERANGE") ) {
        // #EXT-X-BYTERANGE:0@1024, fileSequence2.ts
        return null;
    } else if ( line.startsWith("#EXT-X-TARGETDURATION") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-MEDIA-SEQUENCE") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-KEY") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-PROGRAM-DATE-TIME") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-ALLOW-CACHE") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-PLAYLIST-TYPE") ) {
        // #EXT-X-PLAYLIST-TYPE:<EVENT|VOD>
        let play_list_type = line.split(":")[1].toUpperCase();
        if ( ["VOD", "EVENT"].indexOf(play_list_type) === -1 ){
            play_list_type = "VOD";
        }
        return {"EXT-X-PLAYLIST-TYPE": play_list_type };
    } else if ( line.startsWith("#EXT-X-ENDLIST") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-MEDIA") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-STREAM-INF") ) {
        // #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=737777, gear4/prog_index.m3u8
        let attrs = line.split(":")[1].split(",");
        let url = attrs[attrs.length-1].trim();
        return {
            "EXT-X-STREAM-INF": {
                "url": url
            }
        };
    } else if ( line.startsWith("#EXT-X-DISCONTINUITY") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-I-FRAMES-ONLY") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-I-FRAME-STREAM-INF") ) {
        return null;
    } else if ( line.startsWith("#EXT-X-VERSION") ) {
        return null;
    } else {
        // console.warn("Ooops ...");
        return null;
    }
}

function parse(string, baseUrl, callback){
    var lines = string.replace("\r\n", "\n").split("\n");
    
    var play_list_type = "VOD";
    var segments = [];

    // Merge
    var m3u = lines.reduce(function (a, _b){
        let b = _b.trim();
        if ( b.startsWith("#") ) {
            return a.concat(b);
        } else if ( b === ' ' || b === '' ) {
            return a;
        } else {
            a[a.length-1] = a[a.length-1] + ", " + b;
            return a;
        }
    }, []).map(parseLine).filter(function (item){
        return item !== null;
    });

    // Sub PlayList
    var jobs = 0;
    var onParseDone = function (playlist){
        segments = segments.concat(playlist['segments']);
        if ( jobs === 0 ) {
            callback({
                "type": play_list_type,
                "segments": segments
            });
        }
        jobs -= 1;

    };
    m3u.forEach(function (item){
        let tag = Object.keys(item)[0];
        if ( tag === "EXTINF" ) {
            // FIX URL.
            let url = urljoin(baseUrl, item['EXTINF']['url']);
            item['EXTINF']['url'] = url;
            segments.push(item['EXTINF']);
        } else if ( tag === "EXT-X-STREAM-INF" ) {
            // FIX URL.
            let url = urljoin(baseUrl, item['EXT-X-STREAM-INF']['url']);
            // Download Sub PlayList
            jobs += 1;
            load(url, function (httpResponse){
                var _m3u = arrayBufferToString(httpResponse.body);
                parse(_m3u, getBaseUrl(url), onParseDone);
            });
        }
        return item;
    });
    onParseDone({"segments": []});
}

function stringify(m3u_string){

}

function fromJSON() {

}




function test(){
    // var m3u = [
    //     "#EXTM3U",
    //     "#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=200000",
    //     "gear1/prog_index.m3u8",
    //     "#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=311111",
    //     "gear2/prog_index.m3u8",
    //     "#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=484444",
    //     "gear3/prog_index.m3u8",
    //     "#EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=737777",
    //     "gear4/prog_index.m3u8"
    // ].join("\n");
    // var url = "http://devimages.apple.com/iphone/samples/bipbop/gear3/prog_index.m3u8";
    // var url = "http://solutions.brightcove.com/jwhisenant/hls/apple/bipbop/bipbopall.m3u8";

    var url = "/output/master.m3u8"; // "http://127.0.0.1/output/master.m3u8"

    var baseUrl = getBaseUrl(url);
    var onParseDone = function (playlist){
        console.log(playlist);
    };

    load(url, function (httpResponse){
        var m3u = arrayBufferToString(httpResponse.body);
        parse(m3u, baseUrl, onParseDone);
    });
}

// test();

export default {load, parse, stringify, fromJSON, getBaseUrl, arrayBufferToString};