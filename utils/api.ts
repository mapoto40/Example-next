import axios from 'axios';
import cookies from './cookie';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_SERVER_URI });
