import app from './config/app';
import { env } from './config/env';

app.listen({ port: env.port, host: env.host }, () => {
  console.log('Server running at http://localhost:4000');
});
