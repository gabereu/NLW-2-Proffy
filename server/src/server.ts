import express from 'express'
import cors from 'cors';
import cookieSession, {  } from 'cookie-session';

import routes from './routes';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
}))
app.use(routes);

app.listen(3333);