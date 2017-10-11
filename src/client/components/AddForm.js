import React from 'react'
import axios from 'axios'
import { 
  changeName, changeAge, initializeForm,
  requestData, receiveDataSuccess, receiveDataFailed
} from '../actions'

const AddForm = ({ store }) => {
  const { name, age } = store.getState().form  // storeからフォームの内容を取得

  const handleSubmit = e => {
    e.preventDefault()    // フォームsubmit時のデフォルトの動作を抑制

    store.dispatch(requestData())
    axios.post('/api/characters', {
      name,
      age,
    })  // キャラクターの名前、年齢からなるオブジェクトをサーバーにPOST
    .then(response => {
      store.dispatch(initializeForm())  // submit後はフォームを初期化
      const characterArray = response.data
      store.dispatch(receiveDataSuccess(characterArray))
    })
    .catch(err => {
      console.error(new Error(err))
      store.dispatch(receiveDataFailed())
    })
  }

  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <label>
          名前:
          <input value={name} onChange={e => store.dispatch(changeName(e.target.value))} />
        </label>
        <label>
          年齢:
          <input value={age} onChange={e => store.dispatch(changeAge(e.target.value))} />
        </label>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default AddForm
