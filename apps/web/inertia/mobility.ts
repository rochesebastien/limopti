import type { Data } from '@generated/data';

export type MobilityCatalog = Data.Mobility.MobilityCatalog;
export type Journey = MobilityCatalog['journeys'][number];
export type TransitLine = MobilityCatalog['lines'][number];
