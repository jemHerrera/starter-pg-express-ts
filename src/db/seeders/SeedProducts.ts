import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import {
  ProductsDescription,
  ProductsSchema,
} from "../../utils/types/Products";
import { Product } from "../entities/Product";
import { Products } from "../../utils/types/Products";

export class SeedProducts extends Seeder {
  async run(em: EntityManager): Promise<void> {
    try {
      for (const p of Object.values(Products)) {
        const product = em.create(Product, {
          name: p,
          description: ProductsDescription[p],
        });

        const productEntity = await em.upsert(product);
      }
      await em.flush();
    } catch (e: any) {
      console.error(`Error in seeder SeedProducts: ${JSON.stringify(e)}`);
      if (e.message) {
        console.error(`Error message: ${JSON.stringify(e.message)}`);
      }
    }
  }
}
