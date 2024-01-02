import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function bootstrap() {
  const server: Server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });

  await mongoose
    .connect(config.DATABASE_URL as string)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Database connection error ', err));

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  // process.on('SIGTERM', () => {
  //   console.log('SIGTERM received');
  //   if (server) {
  //     server.close();
  //   }
  // });
}

bootstrap();
