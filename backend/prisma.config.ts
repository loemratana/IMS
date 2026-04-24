import "dotenv/config";
import { defineConfig } from "prisma/config";

const datasourceUrl =
  process.env.DIRECT_URL?.trim() ||
  process.env.DATABASE_URL?.trim();

if (!datasourceUrl) {
  throw new Error(
    "Set DATABASE_URL or DIRECT_URL in backend/.env for Prisma CLI (migrate, db push, etc.)."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
