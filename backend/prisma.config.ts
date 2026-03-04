import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env["DATABASE_URL"];

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined in the .env file");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: dbUrl
  },
});
