# interval-timer


## 開発日誌

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

