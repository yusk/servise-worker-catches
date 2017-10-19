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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  	.then(console.log("Registered serviceWorker."))
    .catch(console.error.bind(console))
  // const appServerURL = location.origin
  // console.log("appServerURL", appServerURL)
  // navigator.serviceWorker.ready.then(function(registration) {
  //   registration.pushManager.getSubscription().then(function(subscription){
  //     console.log("subscription", subscription)
  //     fetch(appServerURL, {
  //       credentials: 'include',
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  //       body: JSON.stringify({
  //         endpoint: subscription.endpoint,
  //         key: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))))
  //                .replace(/\+/g, '-').replace(/\//g, '_'),
  //         auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
  //                .replace(/\+/g, '-').replace(/\//g, '_')
  //       })
  //     })
  //   })
  // })
}
