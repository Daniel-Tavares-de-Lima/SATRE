import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { UNITS_GEODATA } from '../../prisma/units-geodata';

const prisma = new PrismaClient();

/**
 * Upserts verified address and coordinates for existing units (matched by name).
 * Safe to run multiple times after seed or when geodata is corrected.
 */
async function main() {
  let updated = 0;
  let missing = 0;

  for (const unit of UNITS_GEODATA) {
    const result = await prisma.unit.updateMany({
      where: { name: unit.name },
      data: {
        address: unit.address,
        lat: unit.lat,
        lng: unit.lng,
      },
    });

    if (result.count === 0) {
      missing += 1;
      console.warn(`Not found in DB: ${unit.name}`);
      continue;
    }

    updated += result.count;
    console.log(`Updated: ${unit.name} → ${unit.lat}, ${unit.lng}`);
  }

  console.log(`Done. ${updated} unit(s) updated, ${missing} not found.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
