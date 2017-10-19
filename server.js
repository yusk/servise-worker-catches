import path from 'path'
import express from 'express'
import webpush from 'web-push'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import Character from './character' // モデルをimport

const app = express()
const port = 3000
const dbUrl = 'mongodb://localhost/crud' // dbの名前をcrudに指定

const contact   = 'mailto:tdfagamdb186@yahoo.com';
const vapidKeys = webpush.generateVAPIDKeys();

// アプリケーションの連絡先と, サーバーサイドの鍵ペアの情報を登録
webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

// body-parserを適用
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(dbUrl, dbErr => {
  if (dbErr) throw new Error(dbErr)
  else console.log('db connected')

  app.use(express.static('build/client'));
  app.use(express.static('statics'));
  app.use(express.static('src/client/sw'));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './src/client/html/webpush.html'))
  })

  app.get('/csr/0', (req, res) => {
    res.sendFile(path.resolve(__dirname, './src/client/html/index0.html'))
  })

  app.get('/csr/1', (req, res) => {
    res.sendFile(path.resolve(__dirname, './src/client/html/index1.html'))
  })

  app.get('/csr/2', (req, res) => {
    res.sendFile(path.resolve(__dirname, './src/client/html/index2.html'))
  })

  app.get('/ssr/0', (req, res) => {
    res.send(
      ReactDOMServer.renderToString(
        <div>
          <h1>ssr0</h1>
          <div id="root">
          </div>
          <img src="/img/sheep.png" />
          <script src="/main.js" />
        </div>
      )
    )
  })

  app.get('/ssr/1', (req, res) => {
    res.send(
      ReactDOMServer.renderToString(
        <div>
          <h1>ssr1</h1>
          <div id="root">
          </div>
          <img src="/img/elephant.png" />
          <script src="/main.js" />
        </div>
      )
    )
  })

  app.get('/ssr/2', (req, res) => {
    res.send(
      ReactDOMServer.renderToString(
        <div>
          <h1>ssr2</h1>
          <div id="root">
          </div>
          <img src="/img/lion.png" />
          <script src="/main.js" />
        </div>
      )
    )
  })

  // POSTリクエストに対処
  app.post('/api/characters', (request, response) => {
    console.log(request.body)
    const { name, age } = request.body  // 送られてきた名前と年齢を取得

    new Character({
      name,
      age,
    }).save(err => {
      if (err) {
        console.log(err)
        response.status(500).send()
      } else {
        Character.find({}, (findErr, characterArray) => {
          if (findErr) {
            console.log(findErr)
            response.status(500).send()
          } else {
            console.log(characterArray)
            response.status(200).send(characterArray)
          }
        })
      }
    })
  })

  app.get('/api/characters', (request, response) => {
    Character.find({}, (err, characterArray) => {  // 取得したドキュメントをクライアント側と同じくcharacterArrayと命名
      if (err) {
        console.log(err)
        response.status(500).send()
      } else {
        console.log(characterArray)
        response.status(200).send(characterArray)  // characterArrayをレスポンスとして送り返す
      }
    })
  })

  app.put('/api/characters', (request, response) => {
    const { id } = request.body  // updateするキャラクターのidをリクエストから取得
    Character.findByIdAndUpdate(id, { $inc: {"age": 1} }, err => {
      if (err) response.status(500).send()
      else {  // updateに成功した場合、すべてのデータをあらためてfindしてクライアントに送る
        Character.find({}, (findErr, characterArray) => {
          if (findErr) response.status(500).send()
          else response.status(200).send(characterArray)
        })
      }
    })
  })

  app.delete('/api/characters', (request, response) => {
    const { id } = request.body
    Character.findByIdAndRemove(id, err => {
      if (err) response.status(500).send()
      else {
        Character.find({}, (findErr, characterArray) => {
          if (findErr) response.status(500).send()
          else response.status(200).send(characterArray)
        })
      }
    })
  })

  app.get('/api/webpush/get', (req, res) => {
    return res.json({
      publicKey : vapidKeys.publicKey
    });
  });

  // 購読のための POST 先
  app.post('/api/webpush/subscribe', (req, res) => {
    // プッシュ通知の送信先情報 (実際には, DB などから取得)
    const subscription = {
      endpoint : req.body['hidden-endpoint'],
      keys     : {
          auth   : req.body['hidden-auth'],
          p256dh : req.body['hidden-p256dh']
      }
    };

    // プッシュ通知で送信したい任意のデータ
    const payload = JSON.stringify({
      title : req.body['text-title'],
      body  : req.body['text-body'],
      icon  : req.body['url-icon'],
      url   : req.body['url-link']
    });

    // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
    webpush.sendNotification(subscription, payload).then((response) => {
      console.log({
        statusCode : response.statusCode || -1,
        message    : response.message    || ''
      });
      return res.redirect('/')
    }).catch((error) => {
      console.dir(error);
      return res.json({
        statusCode : error.statusCode || -1,
        message    : error.message    || '',
      });
    });
  });

  // MongoDBに接続してからサーバーを立てるために
  // app.listen()をmongoose.connect()の中に移動
  app.listen(port, err => {
    if (err) throw new Error(err)
    else console.log(`listening on port ${port}`)
  })
})
