
// Media Presentation Description

/**
https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP
http://www.bbc.co.uk/rd/blog/2013/09/mpeg-dash-test-streams
http://rdmedia.bbc.co.uk/
http://rdmedia.bbc.co.uk/dash/ondemand/bbb/2/client_manifest-common_init.mpd

<?xml version="1.0" encoding="UTF-8"?>
<MPD type="static" xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT0.451S" mediaPresentationDuration="PT9M32.520S">
<!-- MPEG DASH ISO BMFF test stream with avc3 and common initialisation segments -->
<!-- BBC Research & Development -->
<!-- For more information see http://rdmedia.bbc.co.uk -->
<ProgramInformation>
    <Title>Adaptive Bitrate Test Stream from BBC Research and Development - Full stream with common initialisation segments</Title>
    <Source>BBC Research and Development</Source>
</ProgramInformation>
<Period duration="PT9M32.520S" start="PT0S">
    <AdaptationSet startWithSAP="2" segmentAlignment="true" id="1" sar="1:1" frameRate="25" scanType="progressive" mimeType="video/mp4" >
        <BaseURL>avc3/</BaseURL>
        <SegmentTemplate timescale="1000" duration="3840" media="$RepresentationID$/$Number%06d$.m4s" initialization="1920x1080p25/IS.mp4" />
        <Representation id="1920x1080p25" codecs="avc3.640028" height="1080" width="1920" bandwidth="4741120" />
        <Representation id="896x504p25" codecs="avc3.64001f" height="504" width="896" bandwidth="1416688" />
        <Representation id="704x396p25" codecs="avc3.4d401e" height="396" width="704" bandwidth="843768" />
        <Representation id="512x288p25" codecs="avc3.4d4015" height="288" width="512" bandwidth="449480" />
        <Representation id="1280x720p25" codecs="avc3.640020" height="720" width="1280" bandwidth="2656696" />
    </AdaptationSet>
    <AdaptationSet startWithSAP="2" segmentAlignment="true" id="3" codecs="mp4a.40.2" audioSamplingRate="48000" lang="eng" mimeType="audio/mp4" >
        <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="2"/>
        <BaseURL>audio/</BaseURL>
        <SegmentTemplate timescale="1000" duration="3840" media="$RepresentationID$/$Number%06d$.m4s" initialization="160kbps/IS.mp4" />
        <Representation id="160kbps" bandwidth="160000" />
        <Representation id="96kbps" bandwidth="96000" />
        <Representation id="128kbps" bandwidth="128000" />
    </AdaptationSet>
</Period>
</MPD>

Code:
    https://github.com/Dash-Industry-Forum/dash.js
Player:
    http://dashif.org/reference/players/javascript/1.4.0/samples/dash-if-reference-player/
**/



function parse(s){
    

}

function stringify(m3u_string){

}

function fromJSON() {

}

export default {parse, stringify, fromJSON};