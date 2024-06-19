import { uploadController } from '../drive/uploadController';
import { deleteImage } from '../drive/deleteImages';
import express from 'express';
import cors from 'cors';



const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  return res.send('API SHE&HE Upload Images');
});

app.post('/upload', uploadController );

app.delete('/delete/:fileName', deleteImage);

export { app };