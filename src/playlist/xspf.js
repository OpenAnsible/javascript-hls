
import XML from './xml.js';

/**
http://dir.xiph.org/listen/96831/listen.xspf

<?xml version="1.0" encoding="UTF-8"?>
<playlist version="1" xmlns="http://xspf.org/ns/0/">
    <title>Atm.Fm</title>
    <info>http://atmfm.ru/</info>
    <trackList>
        <track><location>http://5.187.7.114:8000/pt-1</location></track>
    </trackList>
</playlist>

A very simple document looks like this:

<?xml version="1.0" encoding="UTF-8"?>
<playlist version="1" xmlns="http://xspf.org/ns/0/">
  <trackList>
    <track><location>file:///music/song_1.ogg</location></track>
    <track><location>file:///music/song_2.flac</location></track>
    <track><location>file:///music/song_3.mp3</location></track>
  </trackList>
</playlist>
or this:

<?xml version="1.0" encoding="UTF-8"?>
<playlist version="1" xmlns="http://xspf.org/ns/0/">
  <trackList>
     <track><location>http://example.net/song_1.ogg</location></track>
     <track><location>http://example.net/song_2.flac</location></track>
     <track><location>http://example.com/song_3.mp3</location></track>
   </trackList>
 </playlist>


**/
const xmlns = "http://xspf.org/ns/0/";
const Version = {
    V0: 0,
    V1: 1
};

// XSPF Format
const XML_STRING = '<?xml version="1.0" encoding="UTF-8"?><playlist version="1" xmlns="http://xspf.org/ns/0/"><title>Atm.Fm</title><info>http://atmfm.ru/</info><trackList><track><location>http://5.187.7.114:8000/pt-1</location></track></trackList></playlist>';

function XSPF(){

}

XSPF.prototype.toJSON = function (){
    // XSPF to JSPF
    
};

function parse(s){
    var json = XML.parse(s).toJSON();
    return json;
}

function stringify(xml_document){
    return XML.stringify(xml_document);
}

function fromJSON() {

}


export default {parse, stringify, fromJSON}
