'use strict'

import createDebugMessages from 'debug' // 引入debug模組來產生debug訊息
const debug = createDebugMessages('line-login:module') // 設定debug訊息的命名空間
import request from 'request' // 引入request模組，用於處理HTTP請求
import jwt from 'jsonwebtoken' // 引入jsonwebtoken模組，用於處理JWT驗證
import secure_compare from 'secure-compare' // 引入secure-compare模組，用來安全地比較字串
import crypto from 'crypto' // 引入crypto模組，用於生成隨機字串
const api_version = 'v2.1' // 設定LINE API的版本
import Promise from 'bluebird' // 引入bluebird模組來處理Promise
Promise.promisifyAll(request) // 將request的回調函數轉換為Promise格式

/**
@class LineLogin
@description 用於與LINE進行OAuth2授權和登入整合的類別
*/
class LineLogin {
  /**
    @constructor
    @param {Object} options - 初始化LineLogin物件時所需的參數
    @param {String} options.channel_id - LINE頻道ID
    @param {String} options.channel_secret - LINE頻道密鑰
    @param {String} options.callback_url - LINE登入授權完成後的回調URL
    @param {String} [options.scope="profile openid"] - 用戶授權的範圍（例如：profile, openid, email）
    @param {String} [options.prompt] - 設定是否強制顯示用戶授權畫面
    @param {String} [options.bot_prompt="normal"] - 是否顯示將機器人加入好友的選項
    @param {Boolean} [options.verify_id_token=true] - 是否驗證id_token，預設為true
    @param {String} [options.endpoint="line.me"] - LINE API的Endpoint，通常用於測試目的
    */
  constructor(options) {
    const required_params = ['channel_id', 'channel_secret', 'callback_url'] // 必填參數
    const optional_params = [
      'scope',
      'prompt',
      'bot_prompt',
      'session_options',
      'verify_id_token',
      'endpoint',
    ] // 可選參數

    // 檢查所有必填參數是否存在
    required_params.map((param) => {
      if (!options[param]) {
        throw new Error(`Required parameter ${param} is missing.`) // 缺少必填參數則拋出錯誤
      }
    })

    // 檢查所有設定的參數是否有效
    Object.keys(options).map((param) => {
      if (
        !required_params.includes(param) &&
        !optional_params.includes(param)
      ) {
        throw new Error(`${param} is not a valid parameter.`) // 無效參數則拋出錯誤
      }
    })

    // 將設定值保存至物件屬性中
    this.channel_id = options.channel_id
    this.channel_secret = options.channel_secret
    this.callback_url = options.callback_url
    this.scope = options.scope || 'profile openid' // 預設授權範圍為'profile openid'
    this.prompt = options.prompt
    this.bot_prompt = options.bot_prompt || 'normal' // 預設機器人提示為normal
    if (typeof options.verify_id_token === 'undefined') {
      this.verify_id_token = true // 預設驗證id_token為true
    } else {
      this.verify_id_token = options.verify_id_token
    }
    this.endpoint = options.endpoint || 'line.me' // 預設Endpoint為line.me
  }

  /**
    Middleware 來初始化 OAuth2 流程，將用戶重定向至 LINE 的授權端點
    @method auth
    @return {Function} 回傳express的中介函數
    */
  auth() {
    return (req, res, next) => {
      let state = (req.session.line_login_state = LineLogin._random()) // 生成並保存state至session
      let nonce = (req.session.line_login_nonce = LineLogin._random()) // 生成並保存nonce至session
      let url = this.make_auth_url(state, nonce) // 構建授權URL
      return res.redirect(url) // 將用戶重定向至LINE授權頁面
    }
  }

  /**
    返回JSON格式的授權網址，與`auth`類似，但返回JSON而非重定向
    @method authJson
    @return {Function} 回傳express的中介函數
    */
  authJson() {
    return (req, res, next) => {
      let state = LineLogin._random() // 生成state
      let nonce = LineLogin._random() // 生成nonce
      let url = this.make_auth_url(state, nonce) // 構建授權URL
      req.session.line_login_state = state // 保存state至session
      req.session.line_login_nonce = nonce // 保存nonce至session
      console.log(req.session)
      console.log(url)
      return res.json({ url }) // 以JSON格式返回URL
    }
  }

  /**
    用戶授權後的回調處理函數
    @method callback
    @param {Function} s - 授權成功的回調函數
    @param {Function} f - 授權失敗的回調函數
    */
  callback(s, f) {
    return (req, res, next) => {
      console.log(req.session)
      console.log(req.query)

      const f_ = (error) => {
        if (f)
          f(req, res, next, error) // 呼叫失敗的回調函數
        else throw error
      }
      const code = req.query.code // 從回應中取得授權碼
      const state = req.query.state // 從回應中取得state
      console.log(req.session)

      const friendship_status_changed = req.query.friendship_status_changed // 取得好友狀態變更

      if (!code) {
        debug('Authorization failed.')
        console.log('Authorization failed.')
        return f_(new Error('Authorization failed.')) // 若無code則拋出錯誤
      }
      console.log(req.session.line_login_state)
      console.log('state =', state)
      if (!secure_compare(req.session.line_login_state, state)) {
        debug('Authorization failed. State does not match.')
        console.log('Authorization failed. State does not match.')
        return f_(new Error('Authorization failed. State does not match.')) // state不匹配則拋出錯誤
      }
      debug('Authorization succeeded.')
      console.log('Authorization succeeded.')

      this.issue_access_token(code) // 發送請求來獲取access_token
        .then((token_response) => {
          if (this.verify_id_token && token_response.id_token) {
            let decoded_id_token
            try {
              decoded_id_token = jwt.verify(
                token_response.id_token,
                this.channel_secret,
                {
                  audience: this.channel_id,
                  issuer: 'https://access.line.me',
                  algorithms: ['HS256'],
                }
              ) // 驗證id_token
              if (
                !secure_compare(
                  decoded_id_token.nonce,
                  req.session.line_login_nonce
                )
              ) {
                throw new Error('Nonce does not match.') // nonce不匹配則拋出錯誤
              }
              debug('id token verification succeeded.')
              console.log('id token verification succeeded.')
              token_response.id_token = decoded_id_token // 將解碼後的id_token保存
            } catch (exception) {
              debug('id token verification failed.')
              console.log('id token verification failed.')
              f_(new Error('Verification of id token failed.')) // 驗證失敗則拋出錯誤
            }
          }
          delete req.session.line_login_state // 刪除session中的state
          delete req.session.line_login_nonce // 刪除session中的nonce
          s(req, res, next, token_response) // 授權成功，呼叫成功回調函數
        })
        .catch((error) => {
          debug(error)
          f_(error) // 授權失敗，呼叫失敗回調函數
        })
    }
  }

  /**
    生成授權URL
    @method make_auth_url
    @param {String} [nonce] - 防止重放攻擊的隨機字串
    @return {String} 授權URL
    */
  make_auth_url(state, nonce) {
    const client_id = encodeURIComponent(this.channel_id) // 將頻道ID編碼
    const redirect_uri = encodeURIComponent(this.callback_url) // 將回調URL編碼
    const scope = encodeURIComponent(this.scope) // 將授權範圍編碼
    const prompt = encodeURIComponent(this.prompt) // 將提示編碼
    const bot_prompt = encodeURIComponent(this.bot_prompt) // 將機器人提示編碼
    let url = `https://access.${this.endpoint}/oauth2/${api_version}/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&bot_prompt=${bot_prompt}&state=${state}` // 組合授權URL
    if (this.prompt) url += `&prompt=${encodeURIComponent(this.prompt)}` // 如果有提示參數則加入
    if (nonce) url += `&nonce=${encodeURIComponent(nonce)}` // 如果有nonce則加入
    return url
  }

  /**
    使用授權碼來獲取access token
    @method issue_access_token
    @param {String} code - 授權碼
    @return {Object} 包含access token的回應
    */
  issue_access_token(code) {
    const url = `https://api.${this.endpoint}/oauth2/${api_version}/token` // token請求的URL
    const form = {
      grant_type: 'authorization_code', // 授權模式
      code: code, // 授權碼
      redirect_uri: this.callback_url, // 回調URL
      client_id: this.channel_id, // 頻道ID
      client_secret: this.channel_secret, // 頻道密鑰
    }
    return request
      .postAsync({
        url: url,
        form: form, // 發送POST請求來獲取token
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return JSON.parse(response.body) // 如果成功則解析回應
        }
        return Promise.reject(new Error(response.statusMessage)) // 否則拋出錯誤
      })
  }

  /**
    驗證access token
    @method verify_access_token
    @param {String} access_token - access token
    @return {Object} 包含驗證結果的回應
    */
  verify_access_token(access_token) {
    const url = `https://api.${
      this.endpoint
    }/oauth2/${api_version}/verify?access_token=${encodeURIComponent(
      access_token
    )}` // 驗證token的URL
    return request
      .getAsync({
        url: url, // 發送GET請求來驗證token
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return JSON.parse(response.body) // 驗證成功則解析回應
        }
        return Promise.reject(new Error(response.statusMessage)) // 驗證失敗則拋出錯誤
      })
  }

  /**
    使用refresh token來獲取新的access token
    @method refresh_access_token
    @param {String} refresh_token - refresh token
    @return {Object} 包含新的access token的回應
    */
  refresh_access_token(refresh_token) {
    const url = `https://api.${this.endpoint}/oauth2/${api_version}/token` // 刷新token的URL
    const form = {
      grant_type: 'refresh_token', // 授權模式為refresh_token
      refresh_token: refresh_token, // refresh token
      client_id: this.channel_id, // 頻道ID
      client_secret: this.channel_secret, // 頻道密鑰
    }
    return request
      .postAsync({
        url: url,
        form: form, // 發送POST請求來刷新token
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return JSON.parse(response.body) // 刷新成功則解析回應
        }
        return Promise.reject(new Error(response.statusMessage)) // 刷新失敗則拋出錯誤
      })
  }

  /**
    作廢access token
    @method revoke_access_token
    @param {String} access_token - access token
    @return {Null} 無返回值
    */
  revoke_access_token(access_token) {
    const url = `https://api.${this.endpoint}/oauth2/${api_version}/revoke` // 作廢token的URL
    const form = {
      access_token: access_token, // 要作廢的access token
      client_id: this.channel_id, // 頻道ID
      client_secret: this.channel_secret, // 頻道密鑰
    }
    return request
      .postAsync({
        url: url,
        form: form, // 發送POST請求來作廢token
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return null // 成功作廢則返回null
        }
        return Promise.reject(new Error(response.statusMessage)) // 作廢失敗則拋出錯誤
      })
  }

  /**
    獲取用戶的顯示名稱、個人圖像和狀態訊息
    @method get_user_profile
    @param {String} access_token - access token
    @return {Object} 包含用戶個人資料的回應
    */
  get_user_profile(access_token) {
    const url = `https://api.${this.endpoint}/v2/profile` // 用戶個人資料的URL
    const headers = {
      Authorization: 'Bearer ' + access_token, // 授權標頭
    }
    return request
      .getAsync({
        url: url,
        headers: headers, // 發送GET請求來獲取用戶資料
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return JSON.parse(response.body) // 獲取成功則解析回應
        }
        return Promise.reject(new Error(response.statusMessage)) // 獲取失敗則拋出錯誤
      })
  }

  /**
    獲取用戶與LINE登入頻道機器人的好友狀態
    @method get_friendship_status
    @param {String} access_token - access token
    @return {Object} 包含好友狀態的回應
    */
  get_friendship_status(access_token) {
    const url = `https://api.${this.endpoint}/friendship/v1/status` // 好友狀態的URL
    const headers = {
      Authorization: 'Bearer ' + access_token, // 授權標頭
    }
    return request
      .getAsync({
        url: url,
        headers: headers, // 發送GET請求來獲取好友狀態
      })
      .then((response) => {
        if (response.statusCode == 200) {
          return JSON.parse(response.body) // 獲取成功則解析回應
        }
        return Promise.reject(new Error(response.statusMessage)) // 獲取失敗則拋出錯誤
      })
  }

  /**
    生成隨機字串，用於state和nonce
    @method _random
    @return {Number} 隨機字串
    */
  static _random() {
    return crypto.randomBytes(20).toString('hex') // 使用crypto生成隨機字串
  }
}

export default LineLogin // 導出LineLogin類別
