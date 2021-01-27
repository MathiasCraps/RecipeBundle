declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PGUSER: string;
      PGHOST: string;
      PGDATABASE: string;
      PGPASSWORD: string;
      PGPORT: number;
      DOMAIN: string;
      SESSION_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}