import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import App from './components/App'
import rootReducer from './reducers'

const store = createStore(rootReducer) // 2つ目が initialState

const render = () => {
  ReactDOM.render(
    <App store={store} />,
    document.getElementById('root')
  )
}

store.subscribe(() => {
  render()
  // console.log(store.getState().form)   // 動作確認のためコンソール出力
})
render()

// Base64 エンコードからバイナリ形式に変換する
function urlsafeBase64ToBinary(urlsafeBase64) {
    const base64 = urlsafeBase64.replace(/-/g, '+')
                                .replace(/_/g, '/');

    const raw    = window.atob(base64);
    const binary = new Uint8Array(raw.length);

    for (let i = 0, len = binary.length; i < len; i++) {
         binary[i] = raw.charCodeAt(i);
    }

    return binary;
}

Notification.requestPermission().then((permission) => {
  switch (permission) {
    case 'granted':
      console.log("granted")
      break;
    case 'denied':
      console.log("denied")
      break;
    case 'default':
      console.log("default")
      break;
    default:
      break;
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
  	console.log("Registered serviceWorker.")
  	return navigator.serviceWorker.ready
  }).catch(() => {
  	console.error.bind(console)
  }).then((registration) => {
  	const options = {
      method  : 'GET',
      headers : new Headers({ 'Content-Type' : 'application/json' })
    };
    return fetch('/api/webpush/get', options)
      .then((res) => res.json())
      .then((res) => {
      	console.log(res)
        // プッシュサービスに対してプッシュ通知の購読を要求
        return registration.pushManager.subscribe({
          userVisibleOnly      : true,
          applicationServerKey : urlsafeBase64ToBinary(res.publicKey)  // バイナリ形式の公開鍵を渡す
        });
      }).catch((error) => {
          console.dir(error);
          console.log('Fetching public key failed.');
      });
  }).then((subscription) => {
  	console.log(subscription)
    // POST の準備
    document.getElementById('hidden-endpoint').value = subscription.endpoint;
    document.getElementById('hidden-auth').value     = arrayBufferToBase64(subscription.getKey('auth'));    // PushSubscription#getKey の戻り値の型は ArrayBuffer なので, Base64 エンコード文字列に変換する
    document.getElementById('hidden-p256dh').value   = arrayBufferToBase64(subscription.getKey('p256dh'));  // PushSubscription#getKey の戻り値の型は ArrayBuffer なので, Base64 エンコード文字列に変換する
  }).catch((error) => {
    console.dir(error);
    console.error('Subscribing web push failed.');
  });
}

/*
const title    = 'タイトル';
const options  = {
    body : '本文',
    icon : '/img/frog.png',
    data : {
      foo : 'bar'
     }
};

const notification = new Notification(title, options);
*/
