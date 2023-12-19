import { MikroORM } from "@mikro-orm/core";

import mikroOrmConfig from "./_config/mikroOrmConfig";

export async function handler() {
  try {
    const orm = await MikroORM.init(mikroOrmConfig);

    const migrator = orm.getMigrator();

    await migrator.up();

    await orm.close(true);

    console.log("Migration complete.");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(`Error in 'handler' (migrate.ts): ${JSON.stringify(e)}`);

    if (e.message) {
      console.error(`Error message: ${JSON.stringify(e.message)}`);
    }
  }
}

handler();
