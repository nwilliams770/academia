# How video streaming works on the web: An introduction [source](https://medium.com/canal-tech/how-video-streaming-works-on-the-web-an-introduction-7919739f7e1)

From early to late 2000s, video playback on web mostly relied on flash plugin. Web Hyptertext Application Technology Working Group (WHATWG) began working on new version of HTML standard, including native video and audio playback, new known as HTML5. Note this was expedited after Apple's standard on Flash. 
HTML5 brought the `<video>` tag but there's some things we want to do :
- switch to different video qualities on-the-fly to avoid buffering issues, like YouTube does
- live streaming is another case which looks really difficult to implement
- updating audio langauge of content based on user preferences while content is streaming like Netflix does? 

These can be answered natively on most browsers

#### The video tag
Linking video is pretty straight forward in HTML5. It also provides various APIs to play, pause, seek or change speed, all accessible through JavaScript.
All these streaming sites still use video tag but instead of just setting vid file in src attribute, they use **Media Source Extensions**

#### Media Source Extensions (MSE)
Spec from W3C that most browsers implement today, created to allow complex media use cases directly with HTML and JS

The "extensions" add the **MediaSource** object to JS, this is source of video e.g. the object representing our vid's data

Let's see an example:
```javascript
const videoTag = document.getElementById("my-video");

// creating the MediaSource, just with the "new" keyword, and the URL for it
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);

// attaching the MediaSource to the video tag
videoTag.src = url;
```
We're still using HTML5 video tag and `src` attrib, but we're linking to MediaSource object. W3C defined `URL.createObjectURL` static method to allow use to refer to a JS object created on the client

#### Source Buffers
Video is not "pushed" into MediaSource for playback, SourceBuffers used for that
MediaSource contains one or multiple instances of those, each associated with diff type of content

For sake of example, we'll say we have three types:
- audio
- video
- both audio and video
**In reality, a "type" is defined by its MIME type which may include info about media codec(s) used

SourceBuffers all linked to a single MediaSource and each will be used to add our vid data to HTML5 tag directly in JS. A frequent use case is to have two source buffers on our MediaSource: one for vid data, one for audio

Separating vid and audio allows us to more easily manage them server-side

```javascript
// -- Create a MediaSource and attach it to the video (We already learned about that) --

const videoTag = document.getElementById("my-video");
const myMediaSource = new MediaSource();
const url = URL.createObjectURL(myMediaSource);
videoTag.src = url;

// 1. add source buffers

const audioSourceBuffer = myMediaSource
  .addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
const videoSourceBuffer = myMediaSource
  .addSourceBuffer('video/mp4; codecs="avc1.64001e"');

// 2. download and add our audio/video to the SourceBuffers

// for the audio SourceBuffer
fetch("http://server.com/audio.mp4").then(function(response) {
  // The data has to be a JavaScript ArrayBuffer
  return response.arrayBuffer();
}).then(function(audioData) {
  audioSourceBuffer.appendBuffer(audioData);
});

// the same for the video SourceBuffer
fetch("http://server.com/video.mp4").then(function(response) {
  // The data has to be a JavaScript ArrayBuffer
  return response.arrayBuffer();
}).then(function(videoData) {
  videoSourceBuffer.appendBuffer(videoData);
});
```

Note both vid and audio in mp4 format, which is a container format, contained concerned media data but also multiple metedata describing, for example, start time and duration of video

MSE spec does not dictate the media format but common types are mp4 and webm files

#### Media Segments
Fetch media in chunks for more flexibility 
cool fetcher functional programming snippet:
```javascipt
function fetchSegment(url) {
  return fetch(url).then(function(response) {
    return response.arrayBuffer();
  });
}
```
Implementations of this be using Range HTTP header

#### Adaptive Streaming
"auto quality" feature where it is automatically chosen depending on client's network and processing capabilities.
This behavior is possible thanks to concept of media segments; server-side, segments encoded in multiple qualities

Player chooses right segments to download as network or CPU conditions change, usually implemented in JS

#### Switching between languages
Pretty much same as adaptive streaming, fetch different audio based on client input. Also wise to "clear" previous SourceBuffer's contnt when switching language to avoid mixing, can be done via `SourceBuffer.prototype.remove(startTime, endTime)`

Keep in mind why having video and audio separate server-side is more advantageous--think if we kept them together in one file, say we change languages and then have to download video with it, eeek

#### Live contents

