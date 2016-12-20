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

// window.XML_STRING = '<?xml version="1.0" encoding="UTF-8"?><playlist version="1" xmlns="http://xspf.org/ns/0/"><title>Atm.Fm</title><info>http://atmfm.ru/</info><trackList><track><location>http://5.187.7.114:8000/pt-1</location></track></trackList></playlist>';


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

**/

function play(videoDOM, url, codecs){
    var mediaSource = new MediaSource();
    var sourceBuffer = null;
    var endOfStream = false;

    videoDOM.src = window.URL.createObjectURL(mediaSource);
    var fetch_options = null;

    var onFetchDone = function (httpResponse){
        endOfStream = true;
        sourceBuffer.appendBuffer(httpResponse.body);
        if ( videoDOM.paused ) {
            videoDOM.play();
        }
    };
    var onSourceOpen = function (){
        sourceBuffer = mediaSource.addSourceBuffer(codecs);
        sourceBuffer.addEventListener('updateend', function (_) {
            if ( endOfStream === true ) {
                mediaSource.endOfStream();
                console.log(mediaSource.readyState); // ended
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

function play_with_fragments(videoDOM, url, codecs){
    var mediaSource = new MediaSource();
    var sourceBuffer = null;
    var endOfStream = false;

    videoDOM.src = window.URL.createObjectURL(mediaSource);
    var chunkSize = 1024; // 1 K Byte
    var bufferSize = 0;
    var totalSize = 0;

    var fetch_options = {
        "range": [bufferSize, chunkSize-1],
        "timeout": 10
    };

    var onFetchDone = function (httpResponse){
        totalSize = parseInt(httpResponse.headers['content-range'].split("/")[1]);
        var contentLength = parseInt(httpResponse.headers['content-length']);
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
        sourceBuffer.appendBuffer(httpResponse.body);
        if ( videoDOM.paused ) {
            videoDOM.play();
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
            if ( endOfStream === true ) {
                mediaSource.endOfStream();
                // mediaSource.readyState === 'ended'
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

function main (){
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
            play_with_fragments(videoDOM, video.url, video.codecs);
        }
    });
}

window.PlayList = PlayList;
window.play = play;
window.main = main;

window.onload = main;

export default {play};