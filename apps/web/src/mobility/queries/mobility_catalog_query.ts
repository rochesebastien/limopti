export type Position = [longitude: number, latitude: number];

export interface PlaceProjection {
	id: string;
	name: string;
	kind: 'stop' | 'place';
	position: Position;
	lines: string[];
}

export interface TransitLineProjection {
	id: string;
	shortName: string;
	name: string;
	color: string;
	textColor: string;
	status: 'normal' | 'disrupted';
}

export interface JourneyLegProjection {
	id: string;
	mode: 'walk' | 'bus';
	from: string;
	to: string;
	durationMinutes: number;
	distanceMeters: number;
	departure?: string;
	arrival?: string;
	line?: string;
	headsign?: string;
	color?: string;
}

export interface JourneyProjection {
	id: string;
	label: string;
	departure: string;
	arrival: string;
	durationMinutes: number;
	walkingMinutes: number;
	transfers: number;
	theoretical: boolean;
	accessible: boolean;
	legs: JourneyLegProjection[];
}

export interface DisruptionProjection {
	id: string;
	title: string;
	description: string;
	severity: 'minor' | 'major';
	status: 'active' | 'upcoming';
	affectedLines: string[];
	startsAt: string;
	endsAt: string;
	geometryAvailable: boolean;
	source: string;
	isDemo: boolean;
}

export interface TrafficEventProjection {
	id: string;
	road: string;
	section: string;
	level: 'free' | 'dense' | 'congested';
	delayMinutes: number;
	updatedAt: string;
	geometry: Position[];
	source: string;
	isDemo: boolean;
}

export interface MobilitySourceProjection {
	id: string;
	name: string;
	provider: string;
	usage: string;
	license: string;
	status: 'connected' | 'prototype' | 'planned';
	updatedAt?: string;
	validUntil?: string;
	url: string;
	limitation: string;
}

export interface MobilityCatalogProjection {
	meta: {
		isDemo: boolean;
		network: string;
		feedName: string;
		feedUpdatedAt: string;
		feedValidFrom: string;
		feedValidUntil: string;
		realtimeStatus: 'unavailable';
	};
	search: {
		origin: string;
		destination: string;
		departureAt: string;
		/**
		 * False as long as the visitor has not filled both ends of the trip. The
		 * map then simply shows Limoges instead of an itinerary.
		 */
		hasSearch: boolean;
		isSupported: boolean;
	};
	places: PlaceProjection[];
	lines: TransitLineProjection[];
	journeys: JourneyProjection[];
	selectedRouteGeometry: Position[];
	disruptions: DisruptionProjection[];
	traffic: TrafficEventProjection[];
	sources: MobilitySourceProjection[];
}

export interface MobilityCatalogInput {
	origin?: string;
	destination?: string;
}

const places: PlaceProjection[] = [
	{
		id: 'MOBIITI:StopPlace:60357',
		name: 'Pl. W. Churchill',
		kind: 'stop',
		position: [1.253594, 45.831211],
		lines: ['1', '2', '4', '6', '8', '10'],
	},
	{
		id: 'MOBIITI:StopPlace:59092',
		name: 'Gare des Bénédictins',
		kind: 'stop',
		position: [1.265893, 45.836674],
		lines: ['6', '10', 'AERO'],
	},
	{
		id: 'MOBIITI:StopPlace:59073',
		name: 'Pl. Jourdan',
		kind: 'stop',
		position: [1.263761, 45.832077],
		lines: ['1', '2', '4', '8'],
	},
	{
		id: 'MOBIITI:StopPlace:59053',
		name: 'Mairie de Limoges',
		kind: 'stop',
		position: [1.260131, 45.827202],
		lines: ['1', '2', '4'],
	},
	{
		id: 'MOBIITI:StopPlace:59129',
		name: 'Gare Montjovis',
		kind: 'stop',
		position: [1.250531, 45.836109],
		lines: ['4', '11'],
	},
	{
		id: 'limoges-centre',
		name: 'Centre-ville de Limoges',
		kind: 'place',
		position: [1.261105, 45.83153],
		lines: [],
	},
];

function tclLine(
	shortName: string,
	name: string,
	color: string,
	textColor = 'FFFFFF',
	status: TransitLineProjection['status'] = 'normal',
): TransitLineProjection {
	return {
		id: `CA_LIMOGES_METROPOLE:Line:${shortName}`,
		shortName,
		name,
		color: `#${color.toUpperCase()}`,
		textColor: `#${textColor.toUpperCase()}`,
		status,
	};
}

// Complete route catalog from the dedicated TCL GTFS feed published on 2026-08-11.
const lines: TransitLineProjection[] = [
	tclLine('1', 'PANAZOL Rte de Lyon ↔ Pte de Louyat', '009de0'),
	tclLine('2', 'P. Curie ↔ Pôle La Bastide', '1f5da6'),
	tclLine('4', 'Montjovis ↔ Pôle St Lazare', 'ffdd00', '000000', 'disrupted'),
	tclLine('5', 'La Cornue ↔ J. Gagnant', '3b2b80'),
	tclLine('6', 'Mal Juin ↔ Pôle La Bastide', '8a6c32'),
	tclLine('8', 'Mal Joffre ↔ Pl. W. Churchill', '289548'),
	tclLine('10', 'L. Serpollet ↔ Ch. Le Gendre', 'ed1c24'),
	tclLine('11', 'COUZEIX Océalim ↔ LIMOGES Landouge', '5b9bd5', '000000'),
	tclLine('12', 'ISLE L. Aragon ↔ CONDAT sur VIENNE Versanas', 'bf9000'),
	tclLine('13', 'FEYTIAT Plein Bois ↔ LE PALAIS Vert Vallon', '42ab36'),
	tclLine('17', 'Pl. W. Churchill ↔ VERNEUIL Pennevayre', 'f18e00'),
	tclLine('15', 'Pôle La Bastide ↔ Pôle St Lazare', 'ec619f'),
	tclLine('16', 'Pôle La Bastide ↔ La Valoine', '673a8e'),
	tclLine('18', 'LIMOGES Ciel ↔ Beaune', '4a2a80'),
	tclLine('19', 'Pl. W Churchill ↔ PANAZOL Manderesse', 'd085b2'),
	tclLine('20', 'Pl. W. Churchill ↔ Pôle Fougeras', '855946'),
	tclLine('23', 'ZI Nord 3 ↔ LE PALAIS Puy Neige', '034f9a'),
	tclLine('24', 'Pl. W. Churchill / Pôle St Lazare ↔ Fontgeaudrant', 'dc9129', '000000'),
	tclLine('25', 'Pl. W. Churchill ↔ Mas Blanc', '006fb6'),
	tclLine('26', 'Pl. W. Churchill ↔ PEYRILHAC Banèche', 'd3d726', '000000'),
	tclLine('27', 'ISLE Les Champs ↔ Ch. Le Gendre', '009de0'),
	tclLine('28', 'LIMOGES Ciel ↔ VERNEUIL Les Vaseix', 'dbebea', '000000'),
	tclLine('29', 'Pôle Fougeras ↔ RILHAC RANCON Bramaud', 'd085b2', '000000'),
	tclLine('30', 'Pôle Fougeras ↔ RILHAC RANCON Cassepierre École', '7db956'),
	tclLine('31', 'Pôle St Lazare ↔ EYJEAUX Bourg', '9c9662'),
	tclLine('32', 'Pôle St Lazare ↔ SOLIGNAC Bourg via LE VIGEN', 'c0ce2f', '000000'),
	tclLine('33', 'Pl. W. Churchill ↔ VEYRAC Les 5 Routes', 'ffff00', '000000'),
	tclLine('34', 'LIMOGES Ciel ↔ ST JUST LE MARTEL Grateloube', 'f2cb13', '000000'),
	tclLine('36', 'Pôle St Lazare ↔ BOISSEUIL Z.A. La Plaine', '2260ab'),
	tclLine('37', 'Pôle La Bastide ↔ BONNAC Le Masbatin', 'ffe164', '000000'),
	tclLine('38', 'Pl. W. Churchill ↔ COUZEIX Anglard', 'a2c14b', '000000'),
	tclLine('39', 'Montjovis ↔ CHAPTELAT Le Theillol', '86321d'),
	tclLine('41', 'Pl. W. Churchill ↔ Mas Gigou', 'ffd49a', '000000'),
	tclLine('42', 'Pl. W. Churchill ↔ ST JUST LE MARTEL Fontaguly', 'b18475'),
	tclLine('43', 'Pl. W. Churchill ↔ FEYTIAT Mas Gauthier', 'b18475'),
	tclLine('45', 'Pôle La Bastide ↔ Le Theil', 'b69f7b'),
	tclLine('60', 'Villagory ↔ PANAZOL Manderesse', '005b41'),
	tclLine('61', 'PANAZOL Mairie ↔ PANAZOL Manderesse', '623888'),
	tclLine('R2', 'Ch. Le Gendre ↔ P. Curie', '1e5ea7'),
	tclLine('AERO', 'Navette Gare ↔ Aéroport via Pl. W. Churchill', '144390'),
	tclLine('N1', 'L. Serpollet ↔ Ch. Le Gendre', 'e45044', '000000'),
	tclLine('N2', 'Puy Ponchet ↔ Mal Joffre', '10963f', '000000'),
	tclLine('D1', 'PANAZOL Rte de Lyon ↔ Pte de Louyat', '009de0'),
	tclLine('D4', 'Mal Juin ↔ Pôle St Lazare', 'ffdd00', '000000'),
	tclLine('D5', 'La Cornue ↔ Cité R. Dautry', '3b2b80'),
	tclLine('D8', 'Mal Joffre ↔ Puy Ponchet', '289548'),
	tclLine('D10', 'L. Serpollet ↔ Ch. Le Gendre', 'ed1c24'),
];

const selectedRouteGeometry: Position[] = [
	[1.254025, 45.831032],
	[1.25576, 45.8313],
	[1.25764, 45.83161],
	[1.25816, 45.83194],
	[1.25872, 45.83266],
	[1.260919, 45.8345],
	[1.26327, 45.83592],
	[1.265358, 45.836536],
	[1.265813, 45.836632],
];

const journeys: JourneyProjection[] = [
	{
		id: 'churchill-gare-fastest',
		label: 'Le plus rapide',
		departure: '08:08',
		arrival: '08:19',
		durationMinutes: 11,
		walkingMinutes: 5,
		transfers: 0,
		theoretical: true,
		accessible: true,
		legs: [
			{
				id: 'walk-to-churchill',
				mode: 'walk',
				from: 'Position sélectionnée',
				to: 'Pl. W. Churchill quai A',
				durationMinutes: 3,
				distanceMeters: 190,
			},
			{
				id: 'line-6-to-gare',
				mode: 'bus',
				from: 'Pl. W. Churchill quai A',
				to: 'Gare des Bénédictins',
				durationMinutes: 5,
				distanceMeters: 1_180,
				departure: '08:12',
				arrival: '08:17',
				line: '6',
				headsign: 'Pôle La Bastide',
				color: '#8A6C32',
			},
			{
				id: 'walk-from-gare',
				mode: 'walk',
				from: 'Gare des Bénédictins',
				to: 'Destination',
				durationMinutes: 2,
				distanceMeters: 120,
			},
		],
	},
	{
		id: 'churchill-gare-walk',
		label: "Le moins d'attente",
		departure: '08:08',
		arrival: '08:27',
		durationMinutes: 19,
		walkingMinutes: 19,
		transfers: 0,
		theoretical: false,
		accessible: true,
		legs: [
			{
				id: 'walk-direct',
				mode: 'walk',
				from: 'Pl. W. Churchill',
				to: 'Gare des Bénédictins',
				durationMinutes: 19,
				distanceMeters: 1_420,
			},
		],
	},
	{
		id: 'churchill-gare-comfort',
		label: 'Le moins de marche',
		departure: '08:15',
		arrival: '08:39',
		durationMinutes: 24,
		walkingMinutes: 3,
		transfers: 0,
		theoretical: true,
		accessible: true,
		legs: [
			{
				id: 'wait-next-line-6',
				mode: 'walk',
				from: 'Position sélectionnée',
				to: 'Pl. W. Churchill quai A',
				durationMinutes: 2,
				distanceMeters: 90,
			},
			{
				id: 'next-line-6-to-gare',
				mode: 'bus',
				from: 'Pl. W. Churchill quai A',
				to: 'Gare des Bénédictins',
				durationMinutes: 5,
				distanceMeters: 1_180,
				departure: '08:32',
				arrival: '08:37',
				line: '6',
				headsign: 'Pôle La Bastide',
				color: '#8A6C32',
			},
			{
				id: 'short-walk-from-gare',
				mode: 'walk',
				from: 'Gare des Bénédictins',
				to: 'Destination',
				durationMinutes: 1,
				distanceMeters: 60,
			},
		],
	},
];

const disruptions: DisruptionProjection[] = [
	{
		id: 'demo-line-4-works',
		title: 'Travaux — ligne 4 déviée',
		description: "Exemple : l'arrêt Mairie n'est pas desservi vers Pôle St Lazare.",
		severity: 'major',
		status: 'active',
		affectedLines: ['4'],
		startsAt: '2026-08-30T06:00:00+02:00',
		endsAt: '2026-09-04T23:00:00+02:00',
		geometryAvailable: false,
		source: 'Donnée de démonstration',
		isDemo: true,
	},
];

const traffic: TrafficEventProjection[] = [
	{
		id: 'demo-a20-33-34',
		road: 'A20',
		section: 'Échangeur 33 → échangeur 34',
		level: 'congested',
		delayMinutes: 6,
		updatedAt: '2026-08-30T20:05:00+02:00',
		geometry: [
			[1.2873, 45.8625],
			[1.2912, 45.8552],
			[1.294, 45.847],
			[1.296, 45.838],
		],
		source: 'Bison Futé — donnée de démonstration',
		isDemo: true,
	},
];

const sources: MobilitySourceProjection[] = [
	{
		id: 'gtfs-tcl',
		name: 'Réseau urbain TCL — GTFS dédié',
		provider: 'Nouvelle-Aquitaine Mobilités / Limoges Métropole',
		usage: 'Lignes, arrêts, horaires et tracés théoriques',
		license: 'ODbL 1.0',
		status: 'connected',
		updatedAt: '2026-08-11T15:27:00+02:00',
		validUntil: '2026-10-18',
		url: 'https://transport.data.gouv.fr/resources/82348',
		limitation: 'Aucun retard, véhicule ou changement de tracé en temps réel.',
	},
	{
		id: 'osm',
		name: 'OpenStreetMap',
		provider: 'Contributeurs OpenStreetMap',
		usage: 'Fond cartographique et réseau piéton/routier',
		license: 'ODbL 1.0',
		status: 'connected',
		url: 'https://www.openstreetmap.org/copyright',
		limitation: 'Le service de tuiles de démonstration devra être dimensionné pour la production.',
	},
	{
		id: 'bison-fute',
		name: 'Traficolor Limoges',
		provider: 'Bison Futé / DIR Centre-Ouest',
		usage: "État de circulation sur l'A20 et le réseau national non concédé",
		license: 'Licence Ouverte 2.0',
		status: 'prototype',
		url: 'https://transport.data.gouv.fr/datasets/etat-de-circulation-en-temps-reel-sur-le-reseau-national-routier-non-concede',
		limitation: 'Couverture partielle et géométrie à recaler sur OpenStreetMap.',
	},
	{
		id: 'stcl-realtime',
		name: 'Temps réel TCL',
		provider: 'STCLM / Limoges Métropole',
		usage: 'Retards, positions des bus, annulations et déviations',
		license: 'Accès à contractualiser',
		status: 'planned',
		url: 'https://www.stcl.fr/toutes-les-infos-trafic/',
		limitation: 'Aucun flux GTFS-RT ou SIRI ouvert identifié pour Limoges.',
	},
];

export class MobilityCatalogQuery {
	execute(input: MobilityCatalogInput = {}): MobilityCatalogProjection {
		const origin = input.origin?.trim() ?? '';
		const destination = input.destination?.trim() ?? '';
		const normalize = (value: string) => value.toLocaleLowerCase('fr').replaceAll(/\s+/g, ' ');
		const hasSearch = Boolean(origin && destination);
		const isSupported =
			hasSearch &&
			normalize(origin) === normalize('Pl. W. Churchill') &&
			normalize(destination) === normalize('Gare des Bénédictins');

		return {
			meta: {
				isDemo: true,
				network: 'STCLM — Limoges Métropole',
				feedName: 'GTFS TCL dédié',
				feedUpdatedAt: '2026-08-11T15:27:00+02:00',
				feedValidFrom: '2026-08-09',
				feedValidUntil: '2026-10-18',
				realtimeStatus: 'unavailable',
			},
			search: {
				origin,
				destination,
				departureAt: '2026-08-31T08:08:00+02:00',
				hasSearch,
				isSupported,
			},
			places,
			lines,
			journeys: isSupported ? journeys : [],
			selectedRouteGeometry: isSupported ? selectedRouteGeometry : [],
			disruptions,
			traffic,
			sources,
		};
	}
}
