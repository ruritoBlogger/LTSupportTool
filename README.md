## LTSupportTool

LTのサポートを行うツールです

本ツールではLive2D Cubism SDK for Webを使用します。使用する前に必ず使用許諾契約を確認してください。

[Live2D Cubism SDK for web](https://www.live2d.com/download/cubism-sdk/download-web/)

### 開発環境

`src/libs/`に上のリンクからダウンロードできるCubism SDK for Webの`Core`を設置してください。

使用バージョン: (`Cubism 4 SDK for Web R4`)

コンテナを起動すると、 `http://localhost:3000`にページが表示されます

```bash
# 開発環境の生成
$ yarn install && git submodule update --init

# コンテナの生成
$ docker-compose build

# コンテナの起動
$ docker-compose up -d
```

### Live2Dモデルの配置

Live2Dモデルはpublicディレクトリに配置してください。
その後`src/config/model.ts`にて対応するファイルのパスに書き換えてください

### 使用技術

`Next.js`を採用しています.  