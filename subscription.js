import mongoose from 'mongoose'

mongoose.Promise = global.Promise

//  スキーマの作成
//  今回保存したいドキュメントはname(String)とage(Number)の２つのフィールドを持つ
const SubscriptionSchema = new mongoose.Schema({
  endpoint: String,
  auth: String,
  p256dh: String,
})

// モデルの作成
// mongoose.modelの第一引数の複数形の名前（今回だと'Subscriptions'）のコレクションが生成される
const Subscription = mongoose.model('Subscription', SubscriptionSchema)

// モデルをexport
export default Subscription
