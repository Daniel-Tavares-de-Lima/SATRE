import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { UNITS_GEODATA } from '../../prisma/units-geodata';

const prisma = new PrismaClient();

/**
 * Upserts verified address, coordinates, phone and specialties for existing units.
 * Matches by canonical name or aliases so renames are safe.
 */
async function main() {
  let updated = 0;
  let missing = 0;

  for (const unit of UNITS_GEODATA) {
    const matchNames = [unit.name, ...(unit.aliases ?? [])];
    const existing = await prisma.unit.findFirst({
      where: { name: { in: matchNames } },
    });

    if (!existing) {
      missing += 1;
      console.warn(`Not found in DB: ${unit.name}`);
      continue;
    }

    await prisma.unit.update({
      where: { id: existing.id },
      data: {
        name: unit.name,
        address: unit.address,
        lat: unit.lat,
        lng: unit.lng,
        phone: unit.phone ?? null,
      },
    });

    if (unit.specialties?.length) {
      await prisma.unitSpecialty.deleteMany({ where: { unitId: existing.id } });
      await prisma.unitSpecialty.createMany({
        data: unit.specialties.map((specialtyName) => ({
          unitId: existing.id,
          specialtyName,
        })),
      });
    }

    updated += 1;
    console.log(`Updated: ${existing.name} → ${unit.name} (${unit.lat}, ${unit.lng})`);
  }

  console.log(`Done. ${updated} unit(s) updated, ${missing} not found.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
