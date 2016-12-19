
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


XSPF Version 0: http://www.xspf.org/xspf-v0.html#version

<?xml version="1.0" encoding="UTF-8"?>
<playlist version="0" xmlns="http://xspf.org/ns/0/">
    <title></title>           // Option<Text>
    <annotation></annotation> // Option<Text>
    <creator></creator>       // Option<Text>
    <info></info>             // Option<Text>
    <location></location>     // Option<Vec<URI>>
    <identifier></identifier> // Option<Vec<CanonicalID>>
    <image></image>           // Option<URI>
    <date></date>             // Option<ISO8601 creation date>
    <license></license>       // Option<URI>
    <attribution></attribution> // Option<URI>
    <link rel=Option<URI>></link> // Option<Vec<URI>>
    <meta rel=Option<URI>>        // Option<Vec<Text>>
    <trackList>                   // MUST contain one and only one trackList element
        <location>
        <identifier>
        <title>
        <annotation>
        <creator>
        <info>
        <image>
        <album>
        <trackNum>
        <duration>
        <link>
        <meta>
    </trackList>

  <trackList>
     <track><location>http://example.net/song_1.ogg</location></track>
     <track><location>http://example.net/song_2.flac</location></track>
     <track><location>http://example.com/song_3.mp3</location></track>
   </trackList>
 </playlist>
    {
        "xml": {
            "attrs": {
                
            }
        }
    }
**/
const XML_VERSION = "1.0";
const XML_ENCODING = "UTF-8";
const XML_NS = "http://xspf.org/ns/0/";

const XSPF_VERSION = {
    V0: 0,
    V1: 1
};

function Element(tag, attrs, children){
    this.tag   = tag;
    this.attrs = attrs;
    this.children = children;
}
Element.prototype.toXML = function (){

};
Element.prototype.toJSON = function (){

};
Element.prototype.toString = function (){

};


function createElement(tag, attrs, children){
    if ( tag === 'xml' ) {
        let t = Object.keys(attrs).length === 2 && ['version', 'encoding'].filter(function (k){
            return (k in attrs) === true;
        }).length === 2;
        if ( t ) {
            if ( attrs["version"] === XML_VERSION || attrs['encoding'] === XML_ENCODING ) {
                if ( (children instanceof Array) && children.length === 1 ){
                    let sub_tags = ['playlist'];
                    t = sub_tags.indexOf(children[0].tag) !== -1;
                    if ( t ) {
                        return new Element(tag, attrs, children);
                    }
                }
            }
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'playlist' ) {
        let t = Object.keys(attrs).length === 2 && ['version', 'xmlns'].filter(function (k){
            return (k in attrs) === true;
        }).length === 2;
        if ( t ){
            if ( attrs["version"] === XSPF_VERSION.V0 || attrs["version"] === XSPF_VERSION.V1 ){
                if ( attrs['xmlns'] === XML_NS ) {
                    let sub_tags = [
                        'title', 'annotation', 'creator', 'info', 'location', 'identifier',
                        'image', 'date', 'license', 'attribution', 'link', 'meta', 'extension',
                        'trackList'
                    ];
                    if ( !(children instanceof Array) ) {
                        console.error(tag, attrs);
                        throw new Error("oops.");
                    }
                    
                    t = children.filter(function (child){
                        return sub_tags.indexOf(child.tag) !== -1;
                    }).length === children.length;
                    if ( t ) {
                        return new Element(tag, attrs, children);
                    }
                }
            }
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'title' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'annotation' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'creator' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'info' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'location' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, new URL(children));
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'identifier' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, new URL(children));
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'image' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, new URL(children));
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'date' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, new Date(children));
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'license' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, new URL(children));
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'attribution' ) {
        // Note: 该元素已不建议使用。
        if ( (children instanceof Array) ) {
            let sub_tags = ['location', 'identifier'];
            let t = children.filter(function (child){
                return sub_tags.indexOf(child.tag) !== -1;
            }).length === children.length;
            if ( t ) {
                return new Element(tag, attrs, children);
            }
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'link' ) {
        let t = Object.keys(attrs).length === 1 && ['rel'].filter(function (k){
            return (k in attrs) === true;
        }).length === 1;
        if ( t && typeof attrs["rel"] === 'string' ){
            attrs["rel"] = new URL(attrs["rel"]);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }

        if ( typeof children === 'string' ){
            return new Element(tag, attrs, new URL(children));
        }

        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'meta' ) {
        let t = Object.keys(attrs).length === 1 && ['rel'].filter(function (k){
            return (k in attrs) === true;
        }).length === 1;
        if ( t && typeof attrs["rel"] === 'string' ){
            attrs["rel"] = new URL(attrs["rel"]);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }

        if ( typeof children === 'string' ){
            return new Element(tag, attrs, children);
        }
        
    } else if ( tag === 'extension' ) {
        if ( (children instanceof Array) ) {
            return new Element(tag, attrs, children);
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'trackList' ) {
        if ( (children instanceof Array) ) {
            let sub_tags = ['track'];
            let t = children.filter(function (child){
                return sub_tags.indexOf(child.tag) !== -1;
            }).length === children.length;
            if ( t ) {
                return new Element(tag, attrs, children);
            }
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'track' ) {
        if ( (children instanceof Array) ) {
            let sub_tags = [
                'location', 'identifier', 'album', 'trackNum', 'duration',
                'link', 'meta', 'extension'
            ];
            let t = children.filter(function (child){
                return sub_tags.indexOf(child.tag) !== -1;
            }).length === children.length;
            if ( t ) {
                return new Element(tag, attrs, children);
            }
        }
        console.error(tag, attrs);
        throw new Error("oops.");
    } else if ( tag === 'album' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'trackNum' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else if ( tag === 'duration' ) {
        if ( typeof children === 'string' ) {
            return new Element(tag, attrs, children);
        } else {
            console.error(tag, attrs);
            throw new Error("oops.");
        }
    } else{
        // Unknow Element( extension )
        return new Element(tag, attrs, children);
    }
}

function parse(s){
    var json = XML.parse(s).toJSON();
    return json;
}

function stringify(xml_document){
    return XML.stringify(xml_document);
}

function fromJSON() {

}

function test(){
    var xspf_doc = createElement("xml", {"version": XML_VERSION, "encoding": XML_ENCODING}, [
        createElement("playlist", {"version": XSPF_VERSION.V1, "xmlns": XML_NS}, [
            createElement("title", {}, "我的播放列表"),
            createElement("annotation", {}, "这是我的播放列表"),
            createElement("creator", {}, "我"),
            createElement("info", {}, "这是我的播放列表信息"),
            createElement("location", {}, "http://www.example.com/"),
            createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
            createElement("image", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010/head.png"),
            createElement("date", {}, "2016-12-18T22:38:03.417Z"), // ISO 8601 date
            createElement("license", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010/license.txt"), // ISO 8601 date
            createElement("attribution", {}, [
                createElement("location", {}, "http://www.example.com/"),
                createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
            ]),
            createElement("link", {"rel": "http://www.example.com/namespace/version1"}, "http://www.example.com/demo.rdfs"),
            createElement("meta", {"rel": "http://www.example.com/namespace/version1"}, "meta data"),
            createElement("extension", {"application": "http://example.com"}, [
                createElement("cl:clip", {"start": "25000", "end": "34500"}, null),
            ]),
            createElement("trackList", {}, [
                createElement("track", {}, [
                    createElement("location", {}, "http://example.net/song_1.ogg"),
                    createElement("location", {}, "http://example.net/song_1.flac"),
                    createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
                    createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
                    createElement("album", {}, "我的专辑"),
                    createElement("trackNum", {}, "音轨数量"),
                    createElement("duration", {}, "1024"), // milliseconds
                    createElement("link", {"rel": "http://www.example.com/namespace/version1"}, "http://www.example.com/demo.rdfs"),
                    createElement("meta", {"rel": "http://www.example.com/namespace/version1"}, "meta data"),
                    createElement("extension", {"application": "http://example.com"}, [
                        createElement("cl:clip", {"start": "25000", "end": "34500"}, null),
                    ]),
                ]),
                createElement("track", {}, [
                    createElement("location", {}, "http://example.net/song_1.ogg"),
                    createElement("location", {}, "http://example.net/song_1.flac"),
                    createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
                    createElement("identifier", {}, "http://www.example.com/playlist/49325c40-5f39-4f4b-b6e1-2691778c0010"),
                    createElement("album", {}, "我的专辑"),
                    createElement("trackNum", {}, "音轨数量"),
                    createElement("duration", {}, "1024"), // milliseconds
                    createElement("link", {"rel": "http://www.example.com/namespace/version1"}, "http://www.example.com/demo.rdfs"),
                    createElement("meta", {"rel": "http://www.example.com/namespace/version1"}, "meta data"),
                    createElement("extension", {"application": "http://example.com"}, [
                        createElement("cl:clip", {"start": "25000", "end": "34500"}, null),
                    ]),
                    
                ]),
            ]),
            
        ]),
    ]);
    console.log(xspf_doc);
}

test();

export default {parse, stringify, fromJSON}
