"use strict";
// if ( window == undefined ) {
//     import {DOMParser} from 'xmldom';
//     import {XMLSerializer, DOMImplementation} from 'xmldom/dom';
// }

['NodeList', 'DOMTokenList', 'NamedNodeMap',
'Document', 'DocumentFragment', 'DocumentType',
'EntityReference', 'Element', 'Attr',
'ProcessingInstruction', 'Comment', 'Text',
'CDATASection', 'Entity', 'Notation'].forEach(function (k, i){
    if ( !(k in window) || typeof window[k] !== 'function' ) {
        window[k] = function (){};
    }
});

function assert(t){
    return !!t === true;
}

window.NodeList.prototype.toJSON = function (){
    return Array.prototype.map.call(this, function (node, i){
        if ( node.nodeType == node.ELEMENT_NODE && node.nodeName == 'parsererror' ){
            // error
            console.error("[ERROR] parser error.");
            console.error(node);
            return undefined;
        } else if ( node.toJSON && typeof node.toJSON === 'function' ) {
            return node.toJSON();   
        } else {
            console.warn("[WARN] node type not support.");
            console.warn(node);
            return undefined;
        }
    }).filter(function (node, i){
        return node != undefined;
    });
};
window.DOMTokenList.prototype.toJSON = function (){
    return Array.prototype.map.call(this, function (item, i){
        return item;
    });
};
window.NamedNodeMap.prototype.toJSON = function (){
    // The NamedNodeMap interface represents a collection of Attr objects
    var self = this;
    return [...Array(this.length).keys()].map(function (i){
        var attr = self.item(i); // ATTRIBUTE_NODE
        if ( attr && attr.nodeType == Document.ATTRIBUTE_NODE ) {
            return attr.toJSON();
        } else {
            return undefined;
        }
    }).reduce(function (obj, kv){
        if ( typeof kv === 'object' ) {
            return Object.assign(obj, kv);
        } else {
            return obj;
        }
    }, {});
};

window.Document.prototype.toJSON = function (){
    var json = {};
    json.doctype = this.doctype ? this.doctype.toJSON() : null;
    json.characterSet = this.characterSet;
    // json.inputEncoding = this.inputEncoding;
    
    json.contentType = this.contentType;
    // json.styleSheets = this.styleSheets;
    json.childNodes = this.childNodes.toJSON();
    json.nodeType = this.nodeType;
    json.nodeName = this.nodeName;
    json.nodeValue = this.nodeValue;
    return json;
};

window.DocumentFragment.prototype.toJSON = function (){
    console.warn("[WARN] node type not support.");
    console.warn(this);
    return undefined;
};
window.DocumentType.prototype.toJSON = function (){
    var doc_type = {};
    doc_type.name = this.name;
    doc_type.nodeType = this.nodeType;
    doc_type.nodeName = this.nodeName;
    doc_type.nodeValue = this.nodeValue;
    return doc_type;
};
window.EntityReference.prototype.toJSON = function (){
    console.warn("[WARN] node type not support.");
    console.warn(this);
    return undefined;
};
window.Element.prototype.toJSON = function (){
    var elem = {};
    elem.classList = this.classList.toJSON();
    elem.attributes = this.attributes.toJSON();
    elem.id = this.id;
    elem.prefix = this.prefix;
    elem.tagName = this.tagName;
    elem.childNodes = this.childNodes.toJSON();
    elem.nodeType = this.nodeType;
    elem.nodeName = this.nodeName;
    elem.nodeValue = this.nodeValue;
    return elem;
};
window.Attr.prototype.toJSON = function (){
    // this.name: this.value || this.nodeName || this.nodeValue
    var attr = {};
    attr[this.name] = this.value;
    attr.nodeType = this.nodeType;
    return attr;
};
window.ProcessingInstruction.prototype.toJSON = function (){
    console.warn("[WARN] node type not support.");
    console.warn(this);
    return undefined;
};
window.Comment.prototype.toJSON = function (){
    var text = {};
    text.data = this.data;
    text.nodeType = this.nodeType;
    return text;
};
window.Text.prototype.toJSON = function (){
    var text = {};
    text.data = this.data;
    text.nodeType = this.nodeType;
    return text;
};
window.CDATASection.prototype.toJSON = function (){
    var text = {};
    text.data = this.data;
    text.nodeType = this.nodeType;
    return text;
};
window.Entity.prototype.toJSON = function (){
    console.warn("[WARN] node type not support.");
    console.warn(this);
    return undefined;
};
window.Notation.prototype.toJSON = function (){
    console.warn("[WARN] node type not support.");
    console.warn(this);
    return undefined;
};


/**
IE Fix:
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(text);
**/
function parse(xml_string){
    var xml = new DOMParser().parseFromString(xml_string, 'text/xml');
    assert(xml.nodeType === xml.DOCUMENT_NODE);
    assert(typeof xml.xmlVersion === 'string');
    // assert(typeof xml.xmlEncoding === 'UTF-8');
    return xml;
}

function stringify(xml_document){
    assert(xml instanceof window.Document);
    var s = new XMLSerializer();
    return s.serializeToString(xml_document);
}

function fromJSON(json_xml){
    throw new Error("未实现");
}

function test(){
    var xml_string = '<?xml version="1.0" encoding="UTF-8"?><playlist version="1" xmlns="http://xspf.org/ns/0/"><title>Atm.Fm</title><info>http://atmfm.ru/</info><trackList><track><location>http://5.187.7.114:8000/pt-1</location></track></trackList></playlist>';
    var xml_doc = new window.DOMParser().parseFromString(xml_string, 'text/xml');
    console.log(xml_doc);
    var json = xml_doc.toJSON();
    console.log(json);
}

export default {parse, stringify, fromJSON};
