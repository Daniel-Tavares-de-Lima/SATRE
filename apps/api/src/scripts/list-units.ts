import 'dotenv/config';
import { unitsService } from '../services/units.service.js';
import { prisma } from '../lib/prisma.js';

async function main() {
  const units = await unitsService.listUnits();

  console.log(`\n${units.length} unidades encontradas:\n`);
  for (const unit of units) {
    console.log(
      `  ${unit.name.padEnd(32)} ${String(unit.estimatedWaitMinutes).padStart(3)} min | ${String(unit.doctorCount).padStart(2)} médicos | ${unit.type}`,
    );
  }

  const nearby = await unitsService.listNearby(-8.0476, -34.951);
  console.log(`\nPerto de Recife (Caxangá): ${nearby[0]?.name ?? '—'}\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
