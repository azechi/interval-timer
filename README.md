# interval-timer


## 開発日誌

#### 20230420
オブジェクトの始末はどうしたら？
* [AudioNode Lifetime section seems to attempt to make garbage collection observable · Issue #1471 · WebAudio/web-audio-api](https://github.com/WebAudio/web-audio-api/issues/1471)
* [AudioWorklets の沈黙のヒント · Issue #1480 · WebAudio/web-audio-api](https://github.com/WebAudio/web-audio-api/issues/1480)
* https://www.w3.org/TR/2021/REC-webaudio-20210617/#DynamicLifetime
* https://www.w3.org/TR/2021/REC-webaudio-20210617/#AudioNode-actively-processing

すくなくともchromeでbufferSourceNodeをconnect(distination)してstart()した後でstopもdisconnectもしなくてもGCされてるっぽい。


node.connect(ctx.destination)を複数してもいいの？いいっぽい、単純に加算してmixするっぽい。
Web Audio APIでは仕様として、複数の入力を1つの出力にmixするように定められている、っぽい
* https://www.w3.org/TR/webaudio/#channel-up-mixing-and-down-mixing
  * > An AudioNode input has mixing rules for combining the channels from all of the connections to it. 

関係しそうな話題、あとで読む
* [sharedarraybufferを使うための要件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements)
* [A tale of two clocks](https://web.dev/audio-scheduling/)
  * AudioWorkletがないころの話
  * [hacker news](https://news.ycombinator.com/item?id=31935058)
    * [Heavy throttling of chained JS timers beginning in Chrome 88](https://developer.chrome.com/blog/timer-throttling-in-chrome-88/)
  * https://github.com/errozero/beatstepper
* [The State of Real-Time Audio and Video Manipulation in the Browser — Early 2021 | by Seyed Danesh | Medium](https://seyeddanesh.medium.com/the-state-of-real-time-audio-and-video-manipulation-in-the-browser-early-2021-65498c695e86)


#### 20230418
オーディオストリームの時間はどういうものでどう扱ったらいいのかを調べた。  
メトロノーム、タイマーの作例を探した。

あとで読む
* https://github.com/sebpiq/WAAClock ↓のプレゼンタイマーで使われている、これが肝っぽい
* https://github.com/goto920/pesentimer プレゼンタイマー
  * プレゼンタイマーの作者のgithub page https://goto920.github.io/


#### 20230417
windowsのwsl2の中で開発する。

web APIを使うのにhttpsが必要になるだろうから、[スマホ実機で動作を見られるように開発環境を用意した](https://gist.github.com/azechi/d59aef93a463091563ed42ea4fe0e25c)。

viteプロジェクトを--template vanilla tsで開始した。  
* typescript 4.9.3
* vite 4.2.0

viteはtsの型チェックはしないので、型チェックしたかったら `$ npx tsc --noEmit`を自分で実行すること。
tsconfigに`noEmit:true`があるから`--noEmit`は付けなくていい。

viteでもhttpsサーバーできるけどWSLの中のサーバーへLANからアクセスするにはどうせホストwin側で何か仕掛けが必要になる。今回はDocker Desktopでhttpsリバースプロキシを立てるのからviteのhttpsは使わない。

