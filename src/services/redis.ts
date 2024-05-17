import * as dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
  },
});

// interface SessionManager {
//   getSessionItem(key: string): Promise<string | null>;
//   setSessionItem(key: string, value: string): void;
//   removeSessionItem(key: string): void;
//   destroySession(): void;
// }

// // const sessionManager: SessionManager = {
// //   getSessionItem(key) {
// //     return new Promise((resolve, reject) => {
// //       redisClient.get(key, (err, reply) => {
// //         if (err) {
// //           reject(err);
// //         } else {
// //           resolve(reply);
// //         }
// //       });
// //     });
// //   },
// //   setSessionItem(key, value) {
// //     redisClient.set(key, value);
// //   },
// //   removeSessionItem(key) {
// //     redisClient.del(key);
// //   },
// //   destroySession() {
// //     redisClient.flushAll();
// //   },
// // };
