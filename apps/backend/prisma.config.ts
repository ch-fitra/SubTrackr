import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: 'postgresql://fitra:password@localhost:5432/subscription_manager',
  },
});