import { MapPinned } from 'lucide-react';
import {
	AttributionControl,
	GeolocateControl,
	LngLatBounds,
	Map as MapLibreMap,
	NavigationControl,
	Popup,
	setWorkerUrl,
	type StyleSpecification,
} from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef, useState } from 'react';
import type { MobilityCatalog } from '~/mobility';

/**
 * MapLibre resolves its worker from `import.meta.url`, which points at the
 * bundled chunk — a location where the worker file does not exist, so it 404s
 * and the map renders nothing at all. Vite's `?worker&url` emits a real,
 * dependency-resolved worker asset and hands us its URL, which works in
 * development and in the production build alike.
 */
setWorkerUrl(maplibreWorkerUrl);

export interface LimoptiMapProps {
	catalog: MobilityCatalog;
	mode?: 'journey' | 'traffic';
	showJourneyRoute?: boolean;
	className?: string;
}

/** Place W. Churchill / centre-ville, used whenever there is no itinerary to frame. */
const LIMOGES_CENTER: [number, number] = [1.2615, 45.8315];
const LIMOGES_ZOOM = 13.4;

const TILE_URL = import.meta.env.VITE_MAP_TILES_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

function readToken(name: string, fallback: string) {
	if (typeof window === 'undefined') {
		return fallback;
	}

	const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

	return value || fallback;
}

/**
 * OpenStreetMap raster tiles, declared inline. Because the style is a local
 * object rather than a URL, MapLibre never has to fetch it: the map always
 * initialises, `load` always fires, and Limopti's own layers are drawn even if
 * individual tiles are slow or unreachable.
 */
function osmStyle(): StyleSpecification {
	return {
		version: 8,
		sources: {
			osm: {
				type: 'raster',
				tiles: [TILE_URL],
				tileSize: 256,
				minzoom: 0,
				maxzoom: 19,
				attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			},
		},
		layers: [
			{
				id: 'osm-background',
				type: 'background',
				paint: { 'background-color': readToken('--color-surface-muted', '#fafafa') },
			},
			{ id: 'osm', type: 'raster', source: 'osm' },
		],
	};
}

export function LimoptiMap({ catalog, mode = 'journey', showJourneyRoute = true, className = '' }: LimoptiMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		setReady(false);

		const map = new MapLibreMap({
			container,
			style: osmStyle(),
			center: LIMOGES_CENTER,
			zoom: LIMOGES_ZOOM,
			attributionControl: false,
			dragRotate: false,
			pitchWithRotate: false,
			touchPitch: false,
		});

		/** A missing tile must not tear the map down; the layers stay readable. */
		map.on('error', () => {});

		const resizeObserver = new ResizeObserver(() => map.resize());
		resizeObserver.observe(container);

		map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
		map.addControl(
			new GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true,
			}),
			'bottom-right',
		);
		map.addControl(new AttributionControl({ compact: true }), 'bottom-left');

		map.on('load', () => {
			/** Resize first so the framing is computed against the real dimensions. */
			map.resize();
			drawCatalogLayers(map, { catalog, mode, showJourneyRoute });
			setReady(true);
		});

		return () => {
			resizeObserver.disconnect();
			map.remove();
		};
	}, [catalog, mode, showJourneyRoute]);

	return (
		<div className={`bg-surface-muted relative isolate overflow-hidden ${className}`}>
			{/*
			 * MapLibre stamps `.maplibregl-map { position: relative }` on the
			 * container, which overrides an absolutely positioned one and collapses
			 * it to zero height. Sizing it with `size-full` keeps the canvas correct.
			 */}
			<section
				ref={containerRef}
				className="size-full touch-none"
				aria-label={mode === 'traffic' ? 'Carte des perturbations et de la circulation' : 'Carte du trajet sélectionné'}
			/>

			{!ready ? (
				<div className="bg-surface-muted absolute inset-0 z-20 grid place-items-center">
					<MapPinned className="text-faint size-6 animate-pulse" aria-hidden="true" />
					<span className="sr-only">Chargement de la carte…</span>
				</div>
			) : null}
		</div>
	);
}

interface DrawOptions {
	catalog: MobilityCatalog;
	mode: 'journey' | 'traffic';
	showJourneyRoute: boolean;
}

function drawCatalogLayers(map: MapLibreMap, { catalog, mode, showJourneyRoute }: DrawOptions) {
	const accent = readToken('--color-accent', '#e2620b');
	const ink = readToken('--color-ink', '#0a0a0a');
	const surface = readToken('--color-surface', '#ffffff');
	const routeCoordinates = mode === 'journey' && showJourneyRoute ? catalog.selectedRouteGeometry : [];

	if (routeCoordinates.length >= 2) {
		map.addSource('selected-route', {
			type: 'geojson',
			data: {
				type: 'Feature',
				properties: {},
				geometry: { type: 'LineString', coordinates: routeCoordinates },
			},
		});
		map.addLayer({
			id: 'selected-route-casing',
			type: 'line',
			source: 'selected-route',
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: { 'line-color': surface, 'line-width': 10, 'line-opacity': 0.95 },
		});
		map.addLayer({
			id: 'selected-route-line',
			type: 'line',
			source: 'selected-route',
			layout: { 'line-cap': 'round', 'line-join': 'round' },
			paint: { 'line-color': accent, 'line-width': 5 },
		});
	}

	const stopFeatures = catalog.places
		.filter((place) => place.kind === 'stop')
		.map((place) => ({
			type: 'Feature' as const,
			properties: { id: place.id, name: place.name },
			geometry: { type: 'Point' as const, coordinates: place.position },
		}));

	map.addSource('transit-stops', {
		type: 'geojson',
		data: { type: 'FeatureCollection', features: stopFeatures },
	});
	map.addLayer({
		id: 'transit-stops-halo',
		type: 'circle',
		source: 'transit-stops',
		paint: {
			'circle-color': surface,
			'circle-radius': 6,
			'circle-stroke-width': 1,
			'circle-stroke-color': readToken('--color-border-strong', '#d4d4d4'),
		},
	});
	map.addLayer({
		id: 'transit-stops',
		type: 'circle',
		source: 'transit-stops',
		paint: { 'circle-color': accent, 'circle-radius': 3 },
	});

	map.on('mouseenter', 'transit-stops', () => {
		map.getCanvas().style.cursor = 'pointer';
	});
	map.on('mouseleave', 'transit-stops', () => {
		map.getCanvas().style.cursor = '';
	});
	map.on('click', 'transit-stops', (event) => {
		const feature = event.features?.[0];
		const coordinates = feature?.geometry.type === 'Point' ? feature.geometry.coordinates : undefined;

		if (!feature || !coordinates) {
			return;
		}

		new Popup({ closeButton: false, offset: 10 })
			.setLngLat([coordinates[0]!, coordinates[1]!])
			.setText(String(feature.properties?.name ?? 'Arrêt TCL'))
			.addTo(map);
	});

	if (routeCoordinates.length >= 2) {
		const endpoints = [
			{ name: catalog.search.origin, type: 'origin', coordinates: routeCoordinates[0] },
			{ name: catalog.search.destination, type: 'destination', coordinates: routeCoordinates.at(-1) },
		];

		map.addSource('journey-endpoints', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: endpoints.map((point) => ({
					type: 'Feature' as const,
					properties: { name: point.name, type: point.type },
					geometry: { type: 'Point' as const, coordinates: point.coordinates! },
				})),
			},
		});
		map.addLayer({
			id: 'journey-endpoints',
			type: 'circle',
			source: 'journey-endpoints',
			paint: {
				'circle-color': ['match', ['get', 'type'], 'origin', accent, ink],
				'circle-radius': 7,
				'circle-stroke-color': surface,
				'circle-stroke-width': 3,
			},
		});
	}

	if (mode === 'traffic') {
		const trafficColors = {
			congested: readToken('--color-traffic-jam', '#b4271f'),
			dense: readToken('--color-traffic-dense', '#c07806'),
			free: readToken('--color-traffic-free', '#0f7a4f'),
		};

		for (const event of catalog.traffic) {
			map.addSource(`traffic-${event.id}`, {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: { level: event.level },
					geometry: { type: 'LineString', coordinates: event.geometry },
				},
			});
			map.addLayer({
				id: `traffic-${event.id}`,
				type: 'line',
				source: `traffic-${event.id}`,
				layout: { 'line-cap': 'round', 'line-join': 'round' },
				paint: {
					'line-color':
						event.level === 'congested'
							? trafficColors.congested
							: event.level === 'dense'
								? trafficColors.dense
								: trafficColors.free,
					'line-width': 6,
					'line-opacity': 0.9,
				},
			});
		}
	}

	const coordinates = mode === 'traffic' ? catalog.traffic.flatMap((event) => event.geometry) : routeCoordinates;

	/**
	 * With nothing to frame — no itinerary searched yet — the map simply stays on
	 * Limoges rather than zooming somewhere arbitrary.
	 */
	if (coordinates.length) {
		const bounds = coordinates.reduce(
			(current, position) => current.extend([position[0]!, position[1]!]),
			new LngLatBounds(),
		);

		map.fitBounds(bounds, {
			padding: mode === 'traffic' ? 90 : { top: 90, right: 70, bottom: 90, left: 70 },
			maxZoom: 15,
			duration: 0,
		});
	}
}
