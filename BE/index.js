import express from 'express';
import 'dotenv/config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

router(app);

mongoose
    .connect(process.env.MONGODB_URL,{
        autoIndex: false,
    })
    .then(() => {
        console.log('Kết nối thành công');
    })
    .catch((err) => {
        console.log(err);
        process.exit();
    });

app.listen(port);
