"use strict";

/**

*   Apple       HTTP Live Streaming
*   ISO         MPEG DASH (Dynamic Adaptive Streaming over HTTP, ISO/IEC 23009-1)
*   Microsoft   Smooth Streaming
*   Adobe       HDS (HTTP Dynamic Streaming)

*   https://developer.apple.com/streaming/
*   http://tools.ietf.org/html/draft-pantos-http-live-streaming
*   https://bitmovin.com/apple-http-live-streaming-hls/

*   http://dashif.org/guidelines/
*   https://bitmovin.com/dynamic-adaptive-streaming-http-mpeg-dash/

*   https://msdn.microsoft.com/en-us/library/ee958035(v=vs.95).aspx
*   https://www.iis.net/media/experiencesmoothstreaming
*   https://bitmovin.com/microsoft-smooth-streaming-mss/

*   http://www.adobe.com/devnet/hds.html
*   http://www.adobe.com/products/hds-dynamic-streaming.html

HTML5 Flash Video (FLV) Player:
    https://github.com/Bilibili/flv.js

URL Schema:
    http://www.example.com/hls/movie.m3u8
    http://www.example.com/dash/movie.mpd
    http://www.example.com/ism/movie.ism
    http://www.example.com/flash/movie.flv

MediaSource API Example:
    http://dvcs.w3.org/hg/html-media/raw-file/tip/media-source/media-source.html
    http://wwwhtml5rockscom.readthedocs.io/en/latest/content/tutorials/streaming/multimedia/en/

ISO base media file format (ISO BMFF):
    https://en.wikipedia.org/wiki/ISO_base_media_file_format

Browser detection:
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    http://hotoo.me/detector/examples/



PlayList:
    *   m3u/m3u8
    *   mpd(MPEG-DASH)
    *   xspf/jspf (XML format for sharing playlists) http://xspf.org/
**/

import PlayList from './playlist/index.js';
import Http from './net/http.js';

const SupportCodecs = [
    // MPEG-4 , MPEG-TS , MPEG-H (HEVC) , 
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', // AVC_BASELINE
    'video/mp4;codecs="avc1.4D401E,mp4a.40.2"', // AVC_MAIN
    'video/mp4;codecs="avc1.64001E,mp4a.40.2"', // AVC_HIGH
    'video/mp4;codecs="avc1.640028"',
    'video/mp4;codecs="mp4v.20.9"',
    'audio/mp4;codecs="mp4a.40.2"',
    'video/3gpp2;codecs="sevc,s263"', // 3GP
    // MPEG Audio
    'audio/mpeg',
    'audio/aac',
    // MP3 (Chrome Only)
    'audio/mp4; codecs="mp3"',

    // WebM
    'video/webm;codecs="vp8,vorbis"',
    'video/webm;codecs="vp8,opus"',
    'video/webm;codecs="vp9,vorbis"',
    'video/webm;codecs="vp9,opus"',
    'video/webm;codecs="vorbis"',
    'audio/webm;codecs="vorbis"',
    'video/webm;codecs="opus"',
    'audio/webm;codecs="opus"',
].filter(function (codec, i){
    return window.MediaSource.isTypeSupported(codec);
});

/***

load playlist:
    play("http://www.example.com/video.mpd")
    play("http://www.example.com/video.m3u")
    play("http://www.example.com/video.m3u8")
    play("http://www.example.com/video.xspf")

load binary data:
    play("http://www.example.com/video.mp4")
    play("http://www.example.com/video.webm")
    play("http://www.example.com/video.ts")
    play("http://www.example.com/video.flv")

http://devimages.apple.com/iphone/samples/bipbop/gear3/prog_index.m3u8
http://solutions.brightcove.com/jwhisenant/hls/apple/bipbop/bipbopall.m3u8
**/

function play(videoDOM, url, codecs){
    var mediaSource = new MediaSource();
    var sourceBuffer = null;
    var endOfStream = false;

    videoDOM.src = window.URL.createObjectURL(mediaSource);
    var fetch_options = {"responseType": "arraybuffer"};

    var onFetchDone = function (httpResponse){
        endOfStream = true;
        if ( mediaSource.readyState === 'open' ) {
            sourceBuffer.appendBuffer(httpResponse.body);
        }
    };
    var onSourceOpen = function (){
        sourceBuffer = mediaSource.addSourceBuffer(codecs);
        sourceBuffer.addEventListener('updateend', function (_) {
            if ( endOfStream === true && mediaSource.readyState === 'open' ) {
                mediaSource.endOfStream();
            }
            if ( videoDOM.paused ) {
                videoDOM.play();
            }
        });

        Http.fetch(url, function (state, data){
            if ( state === 'SUCCESS' ){
                onFetchDone(data);
            } else if ( state === 'FAILURE' || state === 'REVOKED' ) {
                console.warn("fetch video file fail.");
            }
        }, fetch_options);
    };
    mediaSource.addEventListener('sourceopen', onSourceOpen, false);
    mediaSource.addEventListener('webkitsourceopen', onSourceOpen, false);

    mediaSource.addEventListener('webkitsourceended', function(e) {
        console.log('mediaSource readyState: ' + this.readyState);
    }, false);
}

function play_with_range_request(videoDOM, url, codecs){
    var mediaSource = new MediaSource();
    var sourceBuffer = null;
    var endOfStream = false;

    videoDOM.src = window.URL.createObjectURL(mediaSource);
    var chunkSize = 1024; // 1 K Byte
    var bufferSize = 0;
    var totalSize = 0;

    var fetch_options = {
        "range": [bufferSize, chunkSize-1],
        "timeout": 10,
        "responseType": "arraybuffer"
    };

    var onFetchDone = function (httpResponse){
        var contentLength = 0;
        var header_keys = Object.keys(httpResponse.headers);
        if ( header_keys.indexOf('content-length') === -1 ) {
            console.info(httpResponse.headers);
            window.alert(" Can't find `content-length` header in Http Response.");
            return;
        } else {
            contentLength = parseInt(httpResponse.headers['content-length']);
        }

        if ( header_keys.indexOf('content-range') === -1 ) {
            console.info(httpResponse.headers);
            window.alert("你的服务器不支持 Byte Range Request!");
            totalSize = contentLength;
        } else {
            totalSize = parseInt(httpResponse.headers['content-range'].split("/")[1]);
        }
        
        bufferSize = bufferSize + contentLength;

        if ( bufferSize === totalSize ){
            endOfStream = true;
        } else if ( bufferSize < totalSize ) {
            endOfStream = false;
            fetch_options.range = [bufferSize, bufferSize+chunkSize-1];
            download_fragment();
        } else {
            // 代码不应该执行到这里，如果执行了，意味着 ....
            endOfStream = true;
            console.error("Ooops ...");
        }
        if ( mediaSource.readyState === 'open' ) {
            // console.log(mediaSource.readyState);
            sourceBuffer.appendBuffer(httpResponse.body);
        }
    };
    var download_fragment = function (){
        Http.fetch(url, function (state, data){
            if ( state === 'SUCCESS' ){
                onFetchDone(data);
            } else if ( state === 'FAILURE' || state === 'REVOKED' ) {
                console.warn("fetch video file fail.");
            }
        }, fetch_options);
    };

    var onSourceOpen = function (){
        sourceBuffer = mediaSource.addSourceBuffer(codecs);
        sourceBuffer.addEventListener('updateend', function (_) {
            // mediaSource.readyState = Enum( 'open', 'closed', 'ended' )
            if ( endOfStream === true && mediaSource.readyState === 'open' ) {
                // mediaSource.readyState === 'ended'
                mediaSource.endOfStream();
            }
            if ( videoDOM.paused ) {
                videoDOM.play();
            }
        });
        download_fragment();
    };
    mediaSource.addEventListener('sourceopen', onSourceOpen, false);
    mediaSource.addEventListener('webkitsourceopen', onSourceOpen, false);

    mediaSource.addEventListener('webkitsourceended', function(e) {
        console.log('mediaSource readyState: ' + this.readyState);
    }, false);
}

function test_single_media (){
    window.MediaSource = window.MediaSource || window.WebKitMediaSource;
    if (!!!window.MediaSource) {
        window.alert('MediaSource API is not available');
        return false;
    }

    var videos = [
        {
            "url" : "/assets/video/test.mp4",
            "mime_type": "video/mp4",
            "codecs": 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'
        },
        {
            "url" : "/assets/video/test.webm",
            "mime_type": "video/webm",
            "codecs": 'video/webm;codecs="vp8,vorbis"'
        },
    ];
    videos.forEach(function (video, i){
        if ( SupportCodecs.indexOf(video.codecs) === -1 ) {
            console.warn(video);
            console.warn("Video Codec(#CODEC#) not support.".replace("#CODEC#", video.codecs));
        } else {
            var videoDOM = window.document.getElementById(video.mime_type);
            console.info("play "+video.url);
            play_with_range_request(videoDOM, video.url, video.codecs);
        }
    });
}


function play_with_fragments(videoDOM, playlist, codecs){

    var segments = playlist.segments;
    var sources  = []; // Vec<MediaSource>
    var chunks   = []; // Vec<Uint8Buffer>
    var played = [];

    var endOfStream = false;

    var duration = 0;
    var idx = 0;
    var play_idx = 0;

    videoDOM.onended = function (){
        console.log("video onended");
        tryNext();
    };
    var onsourceopen = function (){
        // console.log("onSourceOpen ... ", this);
        let self = this;
        let sourceBuffer = this.addSourceBuffer(codecs);
        sourceBuffer.mode = 'segments'; // segments , sequence
        sourceBuffer.onupdateend = function (){
            self.endOfStream();
        };
        sourceBuffer.appendBuffer(chunks[play_idx]);
        play_idx += 1;
        // chunks.forEach(function (chunk, i){
        //     sourceBuffer.appendBuffer(chunk);
        // });
        if ( videoDOM.paused ){
            videoDOM.play();
        }
    };
    var tryPlay = function (){
        console.log("try play ... ");
        let mediaSource = new MediaSource();
        mediaSource.onsourceopen = onsourceopen.bind(mediaSource);
        videoDOM.src = window.URL.createObjectURL(mediaSource);
        // chunks
    };
    var tryNext = function (){
        console.log("try play next ... ");
        if ( play_idx <= chunks.length ){
            tryPlay();
        } else {
            console.log("play done.");
        }
    };

    var download_fragment = function (){
        console.log("download fragment: ", idx);
        Http.fetch(segments[idx]["url"], function (state, data){
                if ( state === 'SUCCESS' ){
                    chunks.push(data.body);
                    if ( idx < playlist.segments.length-1 ) {
                        idx += 1;
                        download_fragment();
                    } else {
                        console.log("segments fetch done.");
                        tryPlay();
                    }
                } else if ( state === 'FAILURE' || state === 'REVOKED' ) {
                    console.warn("fetch video file fail.");
                }
            }, {"responseType": "arraybuffer"});
    };
    download_fragment();
}

function test_fragments(){
    var playlist = {
        "segments": [
            {"url": "/assets/video/test.mp4"},
            {"url": "/assets/video/out001_f.mp4"},
            {"url": "/assets/video/out002_f.mp4"},
        ]
    };
    var codecs = 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"';
    window.codecs = codecs;

    window.videoDOM = window.document.getElementById("video/m3u8");
    play_with_fragments(window.videoDOM, playlist, codecs);
}

function test_paly_hls(){
    var url = "/output/master.m3u8"; // "http://127.0.0.1/output/master.m3u8"
    var baseUrl = PlayList.m3u.getBaseUrl(url);
    var onParseDone = function (playlist){
        // segments
        console.log(playlist);
        window.videoDOM = window.document.getElementById("video/m3u8");
        // avc1.64002A avc1.640028
        // video/mp4;codecs="avc1.64001E,mp4a.40.2"
        // video/mp4;codecs="avc1.640028,mp4a.40.2"
        // 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', // AVC_BASELINE
        play_with_fragments(window.videoDOM, playlist, 'video/mp4;codecs="avc1.42E01E,mp4a.40.2');
    };
    PlayList.m3u.load(url, function (httpResponse){
        PlayList.m3u.parse(httpResponse.body, baseUrl, onParseDone);
    });
}

function test(){
    test_single_media();
    test_fragments();
}

// window.PlayList = PlayList;
// window.play = play;
// window.main = main;

window.onload = test;

export default {play};