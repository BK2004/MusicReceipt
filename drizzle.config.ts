import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: './services/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL!,
	}
});