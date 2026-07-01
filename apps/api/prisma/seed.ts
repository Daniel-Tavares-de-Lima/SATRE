import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UNITS = [
  {
    name: 'UPA Caxangá',
    type: 'upa',
    wait: 25,
    doctors: 5,
    patients: 40,
    address: 'R. Ribeiro Pessoa, s/n - Iputinga, Recife - PE, 50980-000',
    lat: -8.0476,
    lng: -34.951,
  },
  {
    name: 'Pronto Atendimento Caxangá',
    type: 'upa',
    wait: 5,
    doctors: 15,
    patients: 12,
    address: 'Av. Prof. Moraes Rego, 314 - Iputinga, Recife - PE, 50670-420',
    lat: -8.052,
    lng: -34.945,
  },
  {
    name: 'Hospital Esperança Recife',
    type: 'private',
    wait: 5,
    doctors: 10,
    patients: 8,
    address: 'R. Antônio Gomes de Freitas, 265 - Ilha do Leite, Recife - PE, 50070-490',
    lat: -8.0635,
    lng: -34.894,
  },
  {
    name: 'UPA Torrões',
    type: 'upa',
    wait: 13,
    doctors: 7,
    patients: 22,
    address: 'Av. Torrões - Torrões, Recife - PE',
    lat: -8.078,
    lng: -34.928,
  },
  {
    name: 'UPA Barra de Jangada',
    type: 'upa',
    wait: 22,
    doctors: 11,
    patients: 35,
    address: 'Barra de Jangada, Jaboatão dos Guararapes - PE',
    lat: -8.128,
    lng: -34.918,
  },
  {
    name: 'UPA Curado',
    type: 'upa',
    wait: 19,
    doctors: 5,
    patients: 28,
    address: 'Curado, Recife - PE',
    lat: -8.035,
    lng: -34.972,
  },
  {
    name: 'Hospital Restauração',
    type: 'private',
    wait: 7,
    doctors: 25,
    patients: 15,
    address: 'Hospital Restauração - Recife, PE',
    lat: -8.058,
    lng: -34.887,
  },
];

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
    return;
  }

  for (const u of UNITS) {
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
