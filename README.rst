JavaScript HTTP Live Streaming
=====================================

:Date: 12/18 2016


.. contents::

介绍
-----

基于 `HTML5` 新增特性 `MSE(Media Source Extensions) <https://w3c.github.io/media-source/>`_ 实现的音视频媒体播放器。


`MSE` 目前支持的流格式:

1.	`MSE-FORMAT-ISOBMFF <https://www.w3.org/TR/mse-byte-stream-format-isobmff/>`_ ,  ISO BMFF Byte Stream Format
2.	`MSE-FORMAT-MP2T <https://www.w3.org/TR/mse-byte-stream-format-mp2t/>`_ ,  MPEG-2 Transport Streams Byte Stream Format
3.	`MSE-FORMAT-WEBM <https://www.w3.org/TR/mse-byte-stream-format-webm/>`_ , WebM Byte Stream Format
4.	`MSE-FORMAT-MPEG-AUDIO <https://www.w3.org/TR/mse-byte-stream-format-mpeg-audio/>`_ , MPEG Audio Byte Stream Format


`Media Source Extensions Byte Stream Format Registry <https://www.w3.org/TR/mse-byte-stream-format-registry/>`_ :

.. code:: javascript
	
	// https://cconcolato.github.io/media-mime-support/
	// https://wiki.whatwg.org/wiki/Video_type_parameters#Video_Codecs_2

	// ISO BMFF Byte Stream Format
	window.MediaSource.isTypeSupported('video/mp4');
	window.MediaSource.isTypeSupported('audio/mp4');
	window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'); // AVC_BASELINE
	window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.4D401E, mp4a.40.2"'); // AVC_MAIN
	window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.64001E, mp4a.40.2"'); // AVC_HIGH
	// WARN: mp4 with no fragments, should rebuild mp4 box 
	window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.640028"');
	window.MediaSource.isTypeSupported('video/mp4; codecs="mp4v.20.9"');
	window.MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.2"');
	window.MediaSource.isTypeSupported('video/3gpp2; codecs="sevc, s263"');

	// WebM Byte Stream Format
	window.MediaSource.isTypeSupported('video/webm');
	window.MediaSource.isTypeSupported('audio/webm');
	window.MediaSource.isTypeSupported('video/webm; codecs="vp8, vorbis"');
	window.MediaSource.isTypeSupported('video/webm; codecs="vp8, opus"');
	window.MediaSource.isTypeSupported('video/webm; codecs="vp9, vorbis"');
	window.MediaSource.isTypeSupported('video/webm; codecs="vp9, opus"');

	window.MediaSource.isTypeSupported('video/webm; codecs="vorbis"');
	window.MediaSource.isTypeSupported('audio/webm; codecs="vorbis"');
	window.MediaSource.isTypeSupported('video/webm; codecs="opus"');
	window.MediaSource.isTypeSupported('audio/webm; codecs="opus"');

	// MPEG-2 Transport Streams Byte Stream Format
	// window.MediaSource.isTypeSupported('video/mp2t');
	// window.MediaSource.isTypeSupported('audio/mp2t');
	window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

	// MPEG Audio Byte Stream Format 
	window.MediaSource.isTypeSupported('audio/mpeg');
	window.MediaSource.isTypeSupported('audio/aac');

	// MP3 (chrome)
	window.MediaSource.isTypeSupported('audio/mp4; codecs="mp3"');


消歧义
-------

*	本项目名字 `HTTP Live Streaming` 并非是指对 `Apple Http Live streaming <https://developer.apple.com/streaming/>`_ 的单一实现。实际上，本项目还涵盖了 `XSPF <http://www.xspf.org>`_ 以及 `MPD(Media Presentation Description) <http://mpeg.chiariglione.org/standards/mpeg-dash/media-presentation-description-and-segment-formats>`_

*	`ISO MPEG-DASH <http://dashif.org>`_ 中的 `MPD(Media Presentation Description) <http://mpeg.chiariglione.org/standards/mpeg-dash/media-presentation-description-and-segment-formats>`_ 和 `MPD(Music Player Daemon) <https://www.musicpd.org/>`_ 是两个不同的东西。


参考
------

*Apple HLS*:

*   `Http Live streaming <https://developer.apple.com/streaming/>`_
*   `RFC draft-pantos-http-live-streaming <http://tools.ietf.org/html/draft-pantos-http-live-streaming>`_

*ISO MPEG-DASH*:

*   `ISO MPEG-DASH <http://dashif.org>`_ , MPEG DASH (Dynamic Adaptive Streaming over HTTP, ISO/IEC 23009-1)

*Microsoft Smooth Streaming*:

*	`Microsoft Smooth Streaming <https://msdn.microsoft.com/en-us/library/ee958035(v=vs.95).aspx>`_
*	`Experience IIS Smooth Streaming <https://www.iis.net/media/experiencesmoothstreaming>`_
*	`BitMovin microsoft-smooth-streaming-mss <https://bitmovin.com/microsoft-smooth-streaming-mss/>`_

*Adobe HDS (HTTP Dynamic Streaming)*:

*	`HDS Technology <http://www.adobe.com/devnet/hds.html>`_
*	`HDS Product <http://www.adobe.com/products/hds-dynamic-streaming.html>`_


*PlayList Format*:

*	`M3U <https://en.wikipedia.org/wiki/M3U>`_ , non-Unicode encoding
*	`M3U8 <https://tools.ietf.org/html/draft-pantos-http-live-streaming-17#section-4>`_ , UTF-8 encoded

*	`MPD <http://mpeg.chiariglione.org/standards/mpeg-dash/media-presentation-description-and-segment-formats>`_
*	`XSPF <http://www.xspf.org/>`_ , ( `JSON XSPF <http://www.xspf.org/jspf/>`_ )


*ISO Base Media File Format*

*	`ISO Base Media File Format <http://mpeg.chiariglione.org/standards/mpeg-4/iso-base-media-file-format>`_
*	`MPEG 102 - Shanghai <http://mpeg.chiariglione.org/meetings/102>`_
