import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import bodyparser from 'body-parser';
import morgan, {  type TokenCallbackFn } from 'morgan';
import YAML from 'yaml';
import swaggerUI from 'swagger-ui-express';
import chalk from 'chalk';
import v1 from './api/v1/v1.api';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const corsOptions = {
  origin: [
    "http://103.127.137.138/",
    "http://103.127.137.138:5173",
    "http://103.127.137.138:5173/",
    "http://103.127.137.138:4173",
    "http://103.127.137.138:4173/",
    "http://103.127.137.138",
    "http://localhost:5173",
    "http://localhost:4173",
    "https://bw2nj1xt-5173.asse.devtunnels.ms",
  ],
  optionsSuccessStatus: 200,
  credentials: true
};

const file = fs.readFileSync(`${__dirname}/api-docs.yaml`, "utf-8");
const swaggerDocument = YAML.parse(file);

const app: Express = express()
  .use(express.json())
  .use(cors(corsOptions))
  .use(express.urlencoded({ extended: true }))
  .use(bodyparser.urlencoded({ extended: true }))
  .get('/', (req: Request, res: Response) => {
    return res.status(200).json({
      status: true,
      message: 'Hello World'
    });
  })
  .use("/custom.css", express.static(path.join(__dirname, "./style.css")))
  .use(
    "/v1/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      customCssUrl: "/custom.css"
    })
  )
  .use('/api/v1', v1)
  .use((req, res, next) => {
    return res.status(404).json({
      status: false,
      message: `Are you lost? ${req.method} ${req.url} is not registered!`,
      data: null
    });
  })
  .use((err : Error, req : Request, res : Response, next : NextFunction) => {
    return res.status(500).json({
      status: false,
      message: err.message,
      data: null
    });
  });

const PORT = process.env.PORT || 5901;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
