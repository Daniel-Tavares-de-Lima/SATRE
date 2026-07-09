/**
 * Verified addresses and coordinates for SATRE mock units.
 * Sources: CNES/Datasus, Carta de Serviços PE, Hapvida, Rede D'Or, portal.saude.pe.gov.br.
 */

export interface UnitGeodata {
  name: string;
  type: 'upa' | 'private';
  address: string;
  lat: number;
  lng: number;
  /** Mock metrics — used only by seed.ts */
  wait: number;
  doctors: number;
  patients: number;
}

/** Canonical geodata for the 7 Recife metro units in the MVP demo. */
export const UNITS_GEODATA: UnitGeodata[] = [
  {
    name: 'UPA Caxangá',
    type: 'upa',
    address: 'Av. Caxangá, s/n - Várzea, Recife - PE, 50980-580',
    lat: -8.04628,
    lng: -34.95458,
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
    name: 'UPA Torrões',
    type: 'upa',
    address: 'Rua Mirabela, 30 - Torrões, Recife - PE, 50640-580',
    lat: -8.05818,
    lng: -34.93142,
    wait: 13,
    doctors: 7,
    patients: 22,
  },
  {
    name: 'UPA Barra de Jangada',
    type: 'upa',
    address: 'R. Cruz Alta, s/n - Barra de Jangada, Jaboatão dos Guararapes - PE, 54270-100',
    lat: -8.12987,
    lng: -34.91185,
    wait: 22,
    doctors: 11,
    patients: 35,
  },
  {
    name: 'UPA Curado',
    type: 'upa',
    address: 'Av. Leonardo da Vinci, 68 - Curado II, Jaboatão dos Guararapes - PE, 54220-000',
    lat: -8.11245,
    lng: -34.96538,
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
