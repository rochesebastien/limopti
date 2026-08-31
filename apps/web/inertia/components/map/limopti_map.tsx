import { Layers3, LocateFixed, MapPinned, RefreshCw, TriangleAlert } from 'lucide-react';
import {
	AttributionControl,
	GeolocateControl,
	LngLatBounds,
	Map as MapLibreMap,
	NavigationControl,
	Popup,
} from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import type { MobilityCatalog } from '~/mobility';

export interface LimoptiMapProps {
	catalog: MobilityCatalog;
	mode?: 'journey' | 'traffic';
	showJourneyRoute?: boolean;
	className?: string;
}

export function LimoptiMap({ catalog, mode = 'journey', showJourneyRoute = true, className = '' }: LimoptiMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<MapLibreMap | null>(null);
	const [ready, setReady] = useState(false);
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!containerRef.current || mapRef.current) {
			return;
		}

		setReady(false);
		setFailed(false);

		const map = new MapLibreMap({
			container: containerRef.current,
			style: import.meta.env.VITE_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/positron',
			center: [1.2635, 45.834],
			zoom: 13.6,
			attributionControl: false,
			dragRotate: false,
			pitchWithRotate: false,
			touchPitch: false,
		});
		mapRef.current = map;
		const resizeObserver = new ResizeObserver(() => map.resize());
		resizeObserver.observe(containerRef.current);
		window.requestAnimationFrame(() => map.resize());

		map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right');
		map.addControl(
			new GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true,
			}),
			'bottom-right',
		);
		map.addControl(new AttributionControl({ compact: true }), 'bottom-left');

		const timeout = window.setTimeout(() => {
			if (!map.isStyleLoaded()) {
				setFailed(true);
			}
		}, 12_000);

		map.on('load', () => {
			window.clearTimeout(timeout);
			setFailed(false);
			const routeCoordinates = mode === 'journey' && showJourneyRoute ? catalog.selectedRouteGeometry : [];

			if (routeCoordinates.length >= 2) {
				const routeData = {
					type: 'Feature' as const,
					properties: {},
					geometry: { type: 'LineString' as const, coordinates: routeCoordinates },
				};

				map.addSource('selected-route', { type: 'geojson', data: routeData });
				map.addLayer({
					id: 'selected-route-casing',
					type: 'line',
					source: 'selected-route',
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': '#ffffff', 'line-width': 10, 'line-opacity': 0.95 },
				});
				map.addLayer({
					id: 'selected-route-line',
					type: 'line',
					source: 'selected-route',
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': '#F97316', 'line-width': 6 },
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
					'circle-color': '#ffffff',
					'circle-radius': 7,
					'circle-stroke-width': 1,
					'circle-stroke-color': '#DCE6E1',
				},
			});
			map.addLayer({
				id: 'transit-stops',
				type: 'circle',
				source: 'transit-stops',
				paint: { 'circle-color': '#F97316', 'circle-radius': 3.5 },
			});
			map.addLayer({
				id: 'transit-stop-labels',
				type: 'symbol',
				source: 'transit-stops',
				minzoom: 14,
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['Noto Sans Regular'],
					'text-size': 11,
					'text-offset': [0, 1.15],
					'text-anchor': 'top',
					'text-allow-overlap': false,
				},
				paint: { 'text-color': '#171717', 'text-halo-color': '#ffffff', 'text-halo-width': 2 },
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
						'circle-color': ['match', ['get', 'type'], 'origin', '#F97316', '#171717'],
						'circle-radius': 8,
						'circle-stroke-color': '#ffffff',
						'circle-stroke-width': 3,
					},
				});
			}

			if (mode === 'traffic') {
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
							'line-color': event.level === 'congested' ? '#D92D20' : event.level === 'dense' ? '#F59E0B' : '#159B62',
							'line-width': 8,
							'line-opacity': 0.92,
						},
					});
				}
			}

			const coordinates = mode === 'traffic' ? catalog.traffic.flatMap((event) => event.geometry) : routeCoordinates;

			if (coordinates.length) {
				const bounds = coordinates.reduce(
					(current, position) => current.extend([position[0]!, position[1]!]),
					new LngLatBounds(),
				);

				map.fitBounds(bounds, {
					padding: mode === 'traffic' ? 100 : { top: 110, right: 90, bottom: 110, left: 90 },
					maxZoom: 15,
					duration: 0,
				});
			}

			setReady(true);
		});

		return () => {
			window.clearTimeout(timeout);
			resizeObserver.disconnect();
			map.remove();
			mapRef.current = null;
		};
	}, [attempt, catalog, mode, showJourneyRoute]);

	return (
		<div className={`bg-surface-muted relative isolate overflow-hidden ${className}`}>
			<section
				ref={containerRef}
				className="absolute inset-0 touch-none"
				aria-label={mode === 'traffic' ? 'Carte des perturbations et de la circulation' : 'Carte du trajet sélectionné'}
			/>

			<div className="pointer-events-none absolute top-4 right-4 left-4 z-10 flex items-start justify-between gap-3">
				<div className="bg-surface/95 text-ink shadow-card flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold backdrop-blur">
					<Layers3 className="text-accent size-4" aria-hidden="true" />
					{mode === 'traffic'
						? 'Trafic et perturbations'
						: showJourneyRoute
							? 'Trajet sélectionné'
							: 'Carte des arrêts'}
				</div>
				<div className="bg-surface/95 text-muted shadow-card hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold backdrop-blur sm:flex">
					<LocateFixed className="size-4" aria-hidden="true" />
					Faites glisser pour explorer
				</div>
			</div>

			{!ready && !failed ? (
				<div className="bg-surface-muted absolute inset-0 z-20 grid place-items-center">
					<div className="text-muted flex flex-col items-center gap-3 text-sm font-semibold">
						<MapPinned className="text-accent size-7 animate-pulse" aria-hidden="true" />
						Chargement de la carte…
					</div>
				</div>
			) : null}

			{failed ? (
				<div
					className="bg-surface/95 absolute inset-x-4 bottom-4 z-30 rounded-2xl p-4 shadow-lg backdrop-blur"
					role="alert"
				>
					<div className="flex items-start gap-3">
						<TriangleAlert className="text-warning mt-0.5 size-5 shrink-0" aria-hidden="true" />
						<div>
							<p className="text-ink text-sm font-bold">La carte ne répond pas</p>
							<p className="text-muted mt-1 text-xs">
								Les informations du trajet restent disponibles dans le panneau. Vous pouvez relancer uniquement la
								carte.
							</p>
							<button
								type="button"
								onClick={() => setAttempt((current) => current + 1)}
								className="border-border bg-surface text-ink hover:bg-surface-muted mt-3 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold shadow-sm"
							>
								<RefreshCw className="size-3.5" aria-hidden="true" />
								Réessayer
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
