

function Hls(){

}

function Dash(){

}

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


function HttpLiveSteam (protocol, url){
    this.PROTOCOLS = ['HLS', 'DASH', 'HDS', 'ISM']
    this.protocol = protocol;
    this.url      = url;
}

HttpLiveSteam.prototype.play = function (){

};
HttpLiveSteam.prototype.pause = function (){

};
HttpLiveSteam.prototype.stop = function (){

};

HttpLiveSteam.prototype.get_speed = function (){

};
HttpLiveSteam.prototype.set_speed = function (){

};
HttpLiveSteam.prototype.get_offset = function (){

};
HttpLiveSteam.prototype.set_offset = function (){

};

