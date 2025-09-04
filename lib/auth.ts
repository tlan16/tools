import {betterAuth} from "better-auth";
import {Kysely} from "kysely"
import {PGlite} from "@electric-sql/pglite"
import {PGliteDialect} from "kysely-pglite-dialect"

export const auth = betterAuth({
  database: {
    dialect: new PGliteDialect(new PGlite())
  },
  socialProviders: {
    google: {
      clientId: process.env['GOOGLE_CLIENT_ID'] as string,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
    },
  },
});
