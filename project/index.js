const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

const port = 3000
const catalog_path = path.resolve(__dirname, './data/showcase.json')
const cart_path = path.resolve(__dirname, './data/cart.json')
const static_dir = path.resolve(__dirname, './public/')

app.use(express.static(static_dir))
app.use(express.json())

app.get('/api/v1/showcase', (req, res) => {
  fs.readFile(catalog_path, 'utf-8', (err, data) => {
    if(!err) {  
        res.send(data);
    } else {
        res.status(500).send(err)
    }
  })
})

app.get('/api/v1/cart', (req, res) => {
  fs.readFile(cart_path, 'utf-8', (err, data) => {
    if(!err) {
      res.send(data);
    } else {
      res.status(500).send(err)
    }
  })
})

app.post('/api/v1/cart', (req, res) => {
  fs.readFile(cart_path, 'utf-8', (err, data) => {
    if(!err) {
      console.log(req.body)
      const cart = JSON.parse(data);
      cart.push(req.body);
      fs.writeFile(cart_path, JSON.stringify(cart), 'utf-8', (err, data) => {
        res.sendStatus(201)
      })
    } else {
      res.status(500).send(err)
    }
  })
})

app.post('/api/v1/cart-delete', (req, res) => {
    fs.readFile(cart_path, 'utf-8', (err, data) => {
      if(!err) {
        // console.log(req.body)
        const idProduct = req.body.result // В тело при отправке писал в формате {"result": id}, где вместо id указывается число
        // console.log(req.body.result)
        const dataParse = JSON.parse(data)
        let product = dataParse.find(item => item.id == idProduct);
        const idx = dataParse.indexOf(product)
        if (idx > -1) {
            dataParse.splice(idx, 1);
            fs.writeFile(cart_path, JSON.stringify(dataParse), 'utf-8', (err, data) => {
                console.log('deleted')
                res.sendStatus(201)
            })
          }
      } else {
        res.status(500).send(err)
      }
    })
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})