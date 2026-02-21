import 'dotenv/config'
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

// import 'dotenv/config'
// import { defineConfig, env } from 'prisma/config';

// const config = {
//   // other configuration options...
//   datasources: {
//     db: {
//       provider: "postgresql",
//       url: env('DATABASE_URL'),
//       directUrl: env('DIRECT_URL'),
//     },
//   },
// };

// export default config;