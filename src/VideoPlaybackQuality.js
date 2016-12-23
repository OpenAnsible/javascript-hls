

function VideoPlaybackQuality(creationTime, corruptedVideoFrames, 
    droppedVideoFrames, totalVideoFrames){
    /**
       Media Playback Quality: 
            https://wicg.github.io/media-playback-quality/
            https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/getVideoPlaybackQuality 
    **/
    this.creationTime = 0;
    this.corruptedVideoFrames = 0;
    this.droppedVideoFrames = 0;
    this.totalVideoFrames = 0;
}

function mozGetVideoPlaybackQuality(VideoElement){
    /**
        Note:
            Firefox 25.0 版本以上都支持了标准的 getVideoPlaybackQuality 方法。

            https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement

                mozParsedFrames
                mozDecodedFrames
                mozPresentedFrames
                mozPaintedFrames
                mozFrameDelay
    **/
    if ( VideoElement.mozParsedFrames
        && VideoElement.mozDecodedFrames
        && VideoElement.mozPresentedFrames
        && VideoElement.mozPaintedFrames
        && VideoElement.mozFrameDelay ) {
        return new VideoPlaybackQuality(0, 0, 
            VideoElement.mozParsedFrames-VideoElement.mozPaintedFrames,
            VideoElement.mozParsedFrames);
    } else {
        throw new Error("oops...");
    }
}
function webkitGetVideoPlaybackQuality(VideoElement){
    /**
    Chrome:
        VideoElement.webkitAudioDecodedByteCount
        VideoElement.webkitVideoDecodedByteCount

        VideoElement.webkitDecodedFrameCount
        VideoElement.webkitDroppedFrameCount
    **/
    if ( VideoElement.webkitDecodedFrameCount
        && VideoElement.webkitDroppedFrameCount ) {
        return new VideoPlaybackQuality(0, 0, 
            VideoElement.webkitDroppedFrameCount,
            VideoElement.webkitDecodedFrameCount+VideoElement.webkitDecodedFrameCount);
    } else {
        throw new Error("oops...");
    }
}

function getVideoPlaybackQuality(VideoElement){
    if ( VideoElement.getVideoPlaybackQuality ) {
        return VideoElement.getVideoPlaybackQuality();
    } else {
        // FIX
        try{
            return webkitGetVideoPlaybackQuality(VideoElement);
        }catch(e){
            try{
                return mozGetVideoPlaybackQuality(VideoElement);
            }catch(e){
                return new VideoPlaybackQuality(0, 0, 0, 0);
            }
        }
    }
}