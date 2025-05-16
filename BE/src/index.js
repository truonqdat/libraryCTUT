import express from 'express';
import 'dotenv/config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import path from "path";
import { fileURLToPath } from "url";
import cron from 'node-cron';
import BorrowService from './services/BorrowRecordServices.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const rootDir = path.join(__dirname, ".."); // Quay về thư mục BE gốc
app.use("/api/uploads", express.static(path.join(rootDir, "public/uploads")));

router(app);

cron.schedule('0 0 * * *', async () => {
    console.log('Running daily overdue check...');
    try {
      await BorrowService.checkOverdueBooks();
      console.log('Overdue check completed');
    } catch (error) {
      console.error('Error in scheduled overdue check:', error);
    }
  });

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
