import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { config } from './config';

const app = express();
app.use(morgan('combined'));

const commandTimeout = 180000; // Timeout for commands in milliseconds
const maxResponse = 2000; // Characters to return
let currentDirectory = "";

app.use(cors({
  origin: ['https://chat.openai.com']
}));
app.use(json());

export { app, commandTimeout, maxResponse, currentDirectory };
