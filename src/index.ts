import express from 'express'
import { config } from 'dotenv'
import { deleteController } from './drive/deleteImages'
import { uploadController } from './drive/uploadController'

config()

const app = express()

const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  return res.send('API SHE&HE Upload Images')
})

app.post('/upload', uploadController)

app.delete('/delete/:fileName', deleteController)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})