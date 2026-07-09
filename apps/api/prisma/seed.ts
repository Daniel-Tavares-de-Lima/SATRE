import { PrismaClient } from '@prisma/client';
import { UNITS_GEODATA } from './units-geodata';

const prisma = new PrismaClient();

const DEFAULT_SPECIALTIES = ['Clínica Médica', 'Pediatria', 'Traumatologia', 'Ortopedia'];

function occupancyFromWait(wait: number): 'low' | 'medium' | 'high' {
  if (wait > 20) return 'high';
  if (wait > 10) return 'medium';
  return 'low';
}

async function main() {
  const existing = await prisma.unit.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} units — skipping seed.`);
    console.log('Run: npm run db:sync-geodata -w @satre/api');
    return;
  }

  for (const u of UNITS_GEODATA) {
    const unit = await prisma.unit.create({
      data: {
        name: u.name,
        type: u.type,
        address: u.address,
        lat: u.lat,
        lng: u.lng,
        accessibilityPhysical: true,
        accessibilityVisual: true,
        accessibilityHearing: true,
        accessibilityNeuro: true,
        specialties: {
          create: DEFAULT_SPECIALTIES.map((specialtyName) => ({ specialtyName })),
        },
        snapshots: {
          create: {
            occupancyLevel: occupancyFromWait(u.wait),
            patientCount: u.patients,
            doctorCount: u.doctors,
            officialWaitMinutes: u.wait,
            source: 'mock',
          },
        },
      },
    });
    console.log('Seeded:', unit.name);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
