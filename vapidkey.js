import mongoose from 'mongoose'

mongoose.Promise = global.Promise

//  スキーマの作成
//  今回保存したいドキュメントはname(String)とage(Number)の２つのフィールドを持つ
const VapidkeySchema = new mongoose.Schema({
  publicKey: String,
  privateKey: String,
  kind: String,
})

// モデルの作成
// mongoose.modelの第一引数の複数形の名前（今回だと'Vapidkeys'）のコレクションが生成される
const Vapidkey = mongoose.model('Vapidkey', VapidkeySchema)

// モデルをexport
export default Vapidkey
