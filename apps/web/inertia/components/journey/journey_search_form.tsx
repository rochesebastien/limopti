import { router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Input } from '@limopti/design-system/input';
import { ArrowDownUp, LocateFixed } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { MobilityCatalog } from '~/mobility';

export function JourneySearchForm({ catalog }: { catalog: MobilityCatalog }) {
	const [origin, setOrigin] = useState(catalog.search.origin);
	const [destination, setDestination] = useState(catalog.search.destination);
	const [locating, setLocating] = useState(false);
	const [locationMessage, setLocationMessage] = useState<{ tone: 'error' | 'info'; text: string }>();

	useEffect(() => {
		setOrigin(catalog.search.origin);
		setDestination(catalog.search.destination);
	}, [catalog.search.destination, catalog.search.origin]);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		router.get('/', { from: origin.trim(), to: destination.trim() }, { preserveScroll: true, only: ['catalog'] });
	}

	function swapPlaces() {
		setOrigin(destination);
		setDestination(origin);
	}

	function locate() {
		setLocationMessage(undefined);

		if (!navigator.geolocation) {
			setLocationMessage({ tone: 'error', text: 'Géolocalisation indisponible sur cet appareil.' });
			return;
		}

		setLocating(true);
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				const nearestPlace = catalog.places.reduce((nearest, place) => {
					const [longitude, latitude] = place.position;
					const distance = Math.hypot(
						(longitude! - coords.longitude) * Math.cos((coords.latitude * Math.PI) / 180),
						latitude! - coords.latitude,
					);
					const [nearestLongitude, nearestLatitude] = nearest.position;
					const nearestDistance = Math.hypot(
						(nearestLongitude! - coords.longitude) * Math.cos((coords.latitude * Math.PI) / 180),
						nearestLatitude! - coords.latitude,
					);

					return distance < nearestDistance ? place : nearest;
				});

				setOrigin(nearestPlace.name);
				setLocationMessage({ tone: 'info', text: `Départ placé sur « ${nearestPlace.name} ».` });
				setLocating(false);
			},
			() => {
				setLocationMessage({ tone: 'error', text: 'Position indisponible. Saisissez un lieu.' });
				setLocating(false);
			},
			{ enableHighAccuracy: true, timeout: 8_000 },
		);
	}

	return (
		<form onSubmit={submit} className="space-y-3" aria-label="Rechercher un itinéraire">
			<div className="border-border bg-surface rounded-card relative border">
				<div className="relative">
					<span className="absolute inset-y-0 left-3.5 flex items-center" aria-hidden="true">
						<span className="border-muted size-2 rounded-full border-2" />
					</span>
					<label className="sr-only" htmlFor="journey-origin">
						Départ
					</label>
					<Input
						id="journey-origin"
						name="from"
						value={origin}
						onChange={(event) => setOrigin(event.target.value)}
						list="limopti-places"
						inputSize="large"
						className="rounded-b-none border-0 border-b pr-11 pl-9"
						autoComplete="off"
						placeholder="Départ"
						required
					/>
					<button
						type="button"
						onClick={locate}
						className="text-faint hover:text-ink absolute inset-y-0 right-9 grid w-8 place-items-center transition-colors"
						aria-label="Utiliser ma position comme départ"
						disabled={locating}
					>
						<LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} aria-hidden="true" />
					</button>
				</div>

				<div className="relative">
					<span className="absolute inset-y-0 left-3.5 flex items-center" aria-hidden="true">
						<span className="bg-accent size-2 rounded-full" />
					</span>
					<label className="sr-only" htmlFor="journey-destination">
						Destination
					</label>
					<Input
						id="journey-destination"
						name="to"
						value={destination}
						onChange={(event) => setDestination(event.target.value)}
						list="limopti-places"
						inputSize="large"
						className="rounded-t-none border-0 pr-11 pl-9"
						autoComplete="off"
						placeholder="Destination"
						required
					/>
				</div>

				<button
					type="button"
					onClick={swapPlaces}
					className="border-border bg-surface text-muted hover:text-ink absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md border transition-colors"
					aria-label="Inverser le départ et la destination"
				>
					<ArrowDownUp className="size-3.5" aria-hidden="true" />
				</button>
			</div>

			<datalist id="limopti-places">
				{catalog.places.map((place) => (
					<option key={place.name} value={place.name}>
						{place.name}
					</option>
				))}
			</datalist>

			{locationMessage ? (
				<p
					className={`text-xs ${locationMessage.tone === 'error' ? 'text-critical' : 'text-muted'}`}
					role={locationMessage.tone === 'error' ? 'alert' : undefined}
				>
					{locationMessage.text}
				</p>
			) : null}

			<Button type="submit" size="large" className="w-full">
				Rechercher
			</Button>
		</form>
	);
}
