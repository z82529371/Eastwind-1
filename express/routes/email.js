import express from 'express'
import transporter from '#configs/mail.js'
import 'dotenv/config.js'

const router = express.Router()

// email內容
const mailOptions = {
  from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
  to: 'a86774546@gmail.com',
  subject: '感謝購買只欠東風的產品',
  text: '感謝購買只欠東風的產品，您的訂單已成功建立。',
  html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Title</title>
      <!-- Required meta tags -->
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <!-- Bootstrap CSS v5.2.1 -->
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
      />
      <style>
        body {
          background-color: #aaaaaa;
        }
        main {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .mail {
          height: 500px;
          margin: 10svh auto;
          background: #ffffff;
          color: #0e0e0e;
          padding: 0 3rem;
        }
      </style>
    </head>
    <body>
      <main>
        <div class="mail">
          <h3>感謝購買 [只欠東風] 的產品</h3>
          <h4>訂單e3c3ee23-ee5e-4f3a-9f90-24fee9已建立成功</h4>
          <p class="m-0">您可點擊下方連結查看最新訂單紀錄</p>
          <p class="m-0">
            訂單網址
            <a href="http://localhost:3000/user/user-center/order?status_now=%E4%BB%98%E6%AC%BE%E5%AE%8C%E6%88%90">
              只欠東風
            </a>
          </p>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th scope="col" style="text-align: left;">商品</th>
                <th scope="col">單價</th>
                <th scope="col">數量</th>
                <th scope="col">價格</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="col" style="text-align: left;">AAAAAAAAAaaaaaaaaaaaaaaAAAAAAA</th>
                <td  style="text-align: left;">990</td>
                <td  style="text-align: left;">1</td>
                <td  style="text-align: left;">NT$ 990</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">AAAAAAAAAAAAAAAA</th>
                <td  style="text-align: left;">990</td>
                <td  style="text-align: left;">1</td>
                <td  style="text-align: left;">NT$ 990</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">AAAAAAAAAAAAAAAA</th>
                <td  style="text-align: left;">990</td>
                <td  style="text-align: left;">1</td>
                <td  style="text-align: left;">NT$ 990</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">小計</th>
                <td  style="text-align: left;">NT$ 990</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">金流: Linepay</th>
                <td  style="text-align: left;">NT$ 0</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">物流: 宅配</th>
                <td  style="text-align: left;">NT$ 60</td>
              </tr>
              <tr>
                <th scope="col" style="text-align: left;">總計</th>
                <td  style="text-align: left;">NT$ 1320</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </body>
  </html>
  `,
}

/* 寄送email的路由 */
router.get('/send', function (req, res, next) {
  // 寄送
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      return res.status(400).json({ status: 'error', message: err })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

export default router
