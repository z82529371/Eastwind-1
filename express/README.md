# express-base-es6-esm

## 版本

v1.2

## !!使用前注意

- git clone後，將`.env.template`改為`.env`檔案，之後進行其中相關設定
- `.env`中`DB_XXX`相關設定，需改為你的資料庫、帳號、密碼才能開始使用


## 指令

express執行:

> 模型對應資料表不存在會自動建立

```sh
npm run dev
```

模型對應資料表建立+種子(範例)資料載入:

```sh
npm run seed
```

資料庫備份(mysqldump):

```sh
npm run backup
```

express執行&除錯(macOS, linux):

```sh
npm run debug
```

express執行&除錯(win):

```sh
npm run debug-win
```

## 設計準則 Design Rules

- [SQL Style Guide](https://www.sqlstyle.guide/zh-tw/)
- [Modern SQL Style Guide](https://gist.github.com/mattmc3/38a85e6a4ca1093816c08d4815fbebfb)

### 資料庫 DB

### 資料表名稱 Table Names

- 全英文小寫(以下底線`_`分隔字詞) Lower Case Table Name
- 英文單數詞 Table name in Singular
- 前綴字名稱 Prefixed Table name

### 欄位名稱 Field Names

- 全英文小寫，無空白與數字
- 選擇短名稱，不超過兩個單詞
- 主鍵(Primary key)使用`id`或`資料表名稱_id`
- 避免使用保留字詞，加上前綴字例如user_name或signup_date
- 避免使用相同於資料表名稱
- 避免使用縮寫或簡稱
- 外鍵(Foreign key)欄位需要有資料表名稱加上它們的主鍵，例如blog_id代表從資料表blog來的外鍵

### API路由 REST API

#### 標準

- [JSend](https://github.com/omniti-labs/jsend)
- [Microsoft Azure REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md)
- [Google JSON guide](https://google.github.io/styleguide/jsoncstyleguide.xml)

#### 範例

成功:

```json
{
    "status" : "success",
    "data" : {
        "post" : { "id" : 1, "title" : "A blog", "body" : "Some content" }
     }
}
```

或 不需要回應資料時(DELETE...)

```json
{
    "status" : "success",
    "data" : null
}
```

失敗:

```json
{
    "status" : "fail",
    "data" : { "title" : "A title is required" }
}
```

錯誤:

```json
{
    "status" : "error",
    "message" : "Unable to communicate with database"
}
```

#### 狀態碼(status code)

```text
GET: 200 OK
POST: 201 Created
PUT: 200 OK
PATCH: 200 OK
DELETE: 204 No Content
```

```text
200 OK - the request was successful and the response contains the requested data
201 Created - the request was successful and a new resource was created
400 Bad Request - the request was invalid or missing required parameters
401 Unauthorized - the client needs to authenticate to access the resource
404 Not Found - the requested resource was not found
500 Internal Server Error - an unexpected error occurred on the server
```

POST

```text
Once you are creating a resource on the server, you should return the 201 status code along with a Location header, allowing the client to locate the newly created resource.

The response payload is optional and it typically describes and links to the resource created.
```

#### 購物車 RESTful API 文件

基本資訊
  - 基礎 URL: /cart
  - 內容類型: application/json
1. 取得購物車內容
  - 路徑: GET /cart/:id
  - 描述: 取得指定用戶的購物車內容以及熱門商品資訊。
  - 路徑參數:
  id (string): 用戶 ID
     - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "已取得購物車",
    "cart": [ /* 購物車項目數據 */ ],
    "top": [ /* 熱門商品數據 */ ]
  }
}
````
    - 狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

2. 新增商品至購物車
  - 路徑: POST /cart/:id/product/:oid
  - 描述: 將指定 ID 的產品新增至指定用戶的購物車。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 產品 ID
  - 需要數據
````
{
  "quantity": (integer),  // 商品數量
  "price": (number)       // 商品價格
}
````
  - 回應:
    - 狀態碼 201 Created
````json
{
  "status": "success",
  "data": {
    "message": "新增成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

3. 新增課程至購物車
  - 路徑: POST /cart/:id/course/:oid
  - 描述: 將指定 ID 的課程新增至指定用戶的購物車。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 課程 ID
  - 需要數據
````
{
  "quantity": (integer),  // 課程數量
  "price": (number)       // 課程價格
}
````
  - 回應:
    - 狀態碼 201 Created
````json
{
  "status": "success",
  "data": {
    "message": "新增成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

5. 更新購物車中的商品數量
  - 路徑: PUT /cart/:id/product/:oid
  - 描述: 更新指定用戶購物車中指定產品的數量。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 產品 ID
  - 需要數據
````json
{
  "quantity": (integer)  // 新的商品數量
}
````
  - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "更新成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

6. 更新購物車中的課程數量
  - 路徑: PUT /cart/:id/course/:oid
  - 描述: 更新指定用戶購物車中指定課程的數量。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 課程 ID
  - 需要數據
````json
{
  "quantity": (integer)  // 新的課程數量
}
````
  - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "更新成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

7. 刪除購物車中的產品
  - 路徑: DELETE /cart/:id/product/:oid
  - 描述: 從指定用戶的購物車中刪除指定產品。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 產品 ID
  - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "刪除成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

8. 刪除購物車中的產品
  - 路徑: DELETE /cart/:id/course/:oid
  - 描述: 從指定用戶的購物車中刪除指定課程。
  - 路徑參數:
    - id (string): 用戶 ID
    - oid (string): 課程 ID
  - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "刪除成功",
    "cart": [ /* 更新後的購物車項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````
#### 我的最愛 RESTful API 文件

基本資訊
  - 基礎 URL: /favorites
  - 內容類型: application/json
1. 取得購物車內容
  - 路徑: GET /favorites
  - 描述: 取得指定用戶的所有收藏。
  - 請求參數:
    - id (string): 用戶 ID
     - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "已取得最愛",
    "fav": [ /* 購物車項目數據 */ ],
  }
}
````
    - 狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "錯誤訊息"
  }
}
````

2. 新增收藏
  - 路徑: POST /favorites/:id
  - 描述: 將指定 ID 的項目新增至指定會員的最愛。
  - 路徑參數:
    - id (string): 產品 ID
- **請求數據**:
  ```json
  {
    "uid": "(string)",  // 會員ID
    "type": "(string)"  // 項目類型
  }
````
  - 回應:
    - 狀態碼 201 Created
````json
{
  "status": "success",
  "data": {
    "message": "新增成功",
    "fav": [ /* 更新後的最愛項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "該產品已在收藏內"
  }
}
````

3. 移除收藏
  - 路徑: DELETE /favorites/:id
  - 描述: 從指定會員的最愛中刪除指定項目。
  - 路徑參數:
    - id (string): 產品 ID
  - **請求數據**:
  ```json
  {
    "uid": "(string)",  // 會員ID
    "type": "(string)"  // 項目類型
  }
  ````
  - 回應:
    - 狀態碼 200 OK
````json
{
  "status": "success",
  "data": {
    "message": "刪除成功",
    "fav": [ /* 更新後的最愛項目數據 */ ]
  }
}
````
    狀態碼 400 Bad Request
````json
{
  "status": "error",
  "data": {
    "message": "收藏內無該商品，刪除失敗"
  }
}
````




#### pagnation

```text
GET /posts?limit=10&offset=0 - retrieves the first 10 posts
GET /posts?limit=10&offset=10 - retrieves the second 10 posts
GET /posts?limit=10&offset=20 - retrieves the third 10 posts, and so on
```

### JWT

- add only unchangeable fields like username, role to JWT

## OTHERS

For postgresql test

> db.js

```js
// for postgresql test
const sequelize = new Sequelize(
  process.env.PG_DB_DATABASE,
  process.env.PG_DB_USERNAME,
  process.env.PG_DB_PASSWORD,
  {
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  }
)
```

> .env

```text
# TEST FOR pgsql
PG_DB_HOST=127.0.0.1
PG_DB_PORT=5432
PG_DB_DATABASE=test
PG_DB_USERNAME=test
PG_DB_PASSWORD=12345
```
