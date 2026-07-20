/**
 * Verified addresses and coordinates for SATRE mock units.
 * Sources: CNES/Datasus, Carta de Serviços PE, Secretaria de Saúde PE, Hapvida, Rede D'Or.
 */

export interface UnitGeodata {
  /** Display name stored in the database. */
  name: string;
  /** Alternate names used to match existing rows when renaming. */
  aliases?: string[];
  type: 'upa' | 'private';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  specialties?: string[];
  /** Mock metrics — used only by seed.ts */
  wait: number;
  doctors: number;
  patients: number;
}

const UPA_CORE_SPECIALTIES = ['Clínica Médica', 'Pediatria', 'Traumatologia', 'Ortopedia'];

/** Canonical geodata for the 7 Recife metro units in the MVP demo. */
export const UNITS_GEODATA: UnitGeodata[] = [
  {
    name: 'UPA Caxangá (Escritor Paulo Cavalcanti)',
    aliases: ['UPA Caxangá'],
    type: 'upa',
    address: 'Av. Caxangá, s/n - Várzea, Recife - PE, 50980-580',
    lat: -8.04628,
    lng: -34.95458,
    specialties: [...UPA_CORE_SPECIALTIES],
    wait: 25,
    doctors: 5,
    patients: 40,
  },
  {
    name: 'Pronto Atendimento Caxangá',
    type: 'upa',
    address: 'Av. Prof. Moraes Rego, 314 - Iputinga, Recife - PE, 50670-420',
    lat: -8.04125,
    lng: -34.9436,
    wait: 5,
    doctors: 15,
    patients: 12,
  },
  {
    name: 'Hospital Esperança Recife',
    type: 'private',
    address: 'R. Antônio Gomes de Freitas, 265 - Ilha do Leite, Recife - PE, 50070-490',
    lat: -8.06124,
    lng: -34.89452,
    wait: 5,
    doctors: 10,
    patients: 8,
  },
  {
    name: 'UPA Torrões – Dulce Sampaio',
    aliases: ['UPA Torrões', 'UPA Torrões - Dulce Sampaio'],
    type: 'upa',
    address:
      'Rua Mirabela, 30 - Torrões, Recife - PE, 50640-580 (próx. Av. Eng. Abdias de Carvalho)',
    lat: -8.05818,
    lng: -34.93142,
    phone: '(81) 3184-4441',
    specialties: ['Clínica Médica', 'Pediatria', 'Ortopedia'],
    wait: 13,
    doctors: 7,
    patients: 22,
  },
  {
    name: 'UPA Barra de Jangada (Senador Wilson Campos)',
    aliases: ['UPA Barra de Jangada'],
    type: 'upa',
    address:
      'Rua Cruz Alta, s/n (em frente à estação da Compesa) - Barra de Jangada, Jaboatão dos Guararapes - PE, 54270-100',
    lat: -8.12987,
    lng: -34.91185,
    specialties: [...UPA_CORE_SPECIALTIES],
    wait: 22,
    doctors: 11,
    patients: 35,
  },
  {
    name: 'UPA Curado (Fernando de Lacerda)',
    aliases: ['UPA Curado', 'UPA do Curado'],
    type: 'upa',
    address: 'Avenida Leonardo da Vinci, 68 - Curado II, Jaboatão dos Guararapes - PE, 54220-000',
    lat: -8.11245,
    lng: -34.96538,
    phone: '(81) 3184-4467',
    specialties: [
      'Clínica Médica',
      'Ortopedia',
      'Traumatologia',
      'Pediatria',
      'Odontologia',
    ],
    wait: 19,
    doctors: 5,
    patients: 28,
  },
  {
    name: 'Hospital Restauração',
    type: 'private',
    address: 'Av. Gov. Agamenon Magalhães, s/n - Derby, Recife - PE, 52010-903',
    lat: -8.05234,
    lng: -34.90167,
    wait: 7,
    doctors: 25,
    patients: 15,
  },
];
