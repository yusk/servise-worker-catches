import React from 'react'
import axios from 'axios'
import { requestData, receiveDataSuccess, receiveDataFailed } from '../actions'

const CharacterList = ({ store }) => {
  const { isFetching, characterArray } = store.getState().characters

  const handleFetchData = () => {
    store.dispatch(requestData())  // axios.get()を呼ぶ前にisFetchingをtrueにしておく
    axios.get('/api/characters')
    .then(response => {  // データ受け取りに成功した場合
      const _characterArray = response.data
      console.log(_characterArray)
      store.dispatch(receiveDataSuccess(_characterArray))    // データをstoreに保存するとともにisFetchingをfalseに
    })
    .catch(err => {  // データ受け取りに失敗した場合
      console.log("err")
      console.error(new Error(err))
      store.dispatch(receiveDataFailed())  // isFetchingをfalseに
    })
  }

  const handleUpdateCharacter = id => {
    store.dispatch(requestData())
    axios.put('/api/characters', {
      id,
    })
    .then(response => {
      const _characterArray = response.data
      store.dispatch(receiveDataSuccess(_characterArray))
    })
    .catch(err => {
      console.error(new Error(err))
      store.dispatch(receiveDataFailed())
    })
  }

  const handleDeleteCharacter = id => {
    store.dispatch(requestData())
    // 気持ちとしては、axios.delete('/api/characters', { id })
    axios({
      method: 'delete',
      url: '/api/characters',
      data: {
        id,
      }
    })
    .then(response => {
      const _characterArray = response.data
      store.dispatch(receiveDataSuccess(_characterArray))
    })
    .catch(err => {
      console.error(new Error(err))
      store.dispatch(receiveDataFailed())
    })
  }

  return (
    <div>
      {
        isFetching  // isFetchingの値で分岐
          ? <h2>Now Loading...</h2>  // データをFetch中ならばローディングアイコンを表示
          : <div>
              <button onClick={() => handleFetchData()}>fetch data</button>
              <ul>
                {characterArray.map(character => (
                  <li key={character._id}>
                    {`${character.name} (${character.age})`}
                    <button onClick={() => handleUpdateCharacter(character._id)}>+1</button>
                    <button onClick={() => handleDeleteCharacter(character._id)}>delete</button>
                  </li>
                ))}
              </ul>
            </div>
      }
    </div>
  )
}

export default CharacterList