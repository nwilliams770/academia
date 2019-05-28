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
