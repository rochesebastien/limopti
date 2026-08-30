import { router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Input } from '@limopti/design-system/input';
import { ArrowDownUp, CalendarClock, LocateFixed, MapPin, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { MobilityCatalog } from '~/mobility';

export function JourneySearchForm({ catalog }: { catalog: MobilityCatalog }) {
	const [origin, setOrigin] = useState(catalog.search.origin);
	const [destination, setDestination] = useState(catalog.search.destination);
	const [locating, setLocating] = useState(false);
	const [locationError, setLocationError] = useState<string>();
	const [locationNotice, setLocationNotice] = useState<string>();

	const placeNames = catalog.places.map((place) => place.name);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		router.get(
			'/',
			{ from: origin, to: destination },
			{ preserveScroll: true, preserveState: true, only: ['catalog'] },
		);
	}

	function swapPlaces() {
		setOrigin(destination);
		setDestination(origin);
	}

	function locate() {
		setLocationError(undefined);
		setLocationNotice(undefined);

		if (!navigator.geolocation) {
			setLocationError('La géolocalisation n’est pas disponible sur cet appareil.');
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
				setLocationNotice(`Départ rapproché du point connu « ${nearestPlace.name} ».`);
				setLocating(false);
			},
			() => {
				setLocationError('Position refusée ou indisponible. Saisissez un lieu à la place.');
				setLocating(false);
			},
			{ enableHighAccuracy: true, timeout: 8_000 },
		);
	}

	return (
		<form onSubmit={submit} className="space-y-4" aria-label="Rechercher un itinéraire">
			<div className="relative space-y-2">
				<div className="relative">
					<span className="absolute inset-y-0 left-3.5 flex items-center" aria-hidden="true">
						<span className="bg-brand-lime ring-surface size-2.5 rounded-full ring-2" />
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
						className="pr-12 pl-10 font-semibold"
						autoComplete="off"
					/>
					<button
						type="button"
						onClick={locate}
						className="text-muted hover:bg-surface-muted hover:text-accent absolute inset-y-1 right-1 grid aspect-square place-items-center rounded-xl transition-colors"
						aria-label="Utiliser ma position comme départ"
						disabled={locating}
					>
						<LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} aria-hidden="true" />
					</button>
				</div>

				<div
					className="absolute top-[2.65rem] left-[1.08rem] h-4 border-l-2 border-dotted border-[#8ca096]"
					aria-hidden="true"
				/>

				<div className="relative">
					<MapPin className="text-accent absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden="true" />
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
						className="pr-12 pl-10 font-semibold"
						autoComplete="off"
					/>
					<button
						type="button"
						onClick={swapPlaces}
						className="border-border bg-surface text-muted hover:text-accent absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-xl border shadow-sm transition-colors"
						aria-label="Inverser le départ et la destination"
					>
						<ArrowDownUp className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<datalist id="limopti-places">
				{placeNames.map((name) => (
					<option key={name} value={name}>
						{name}
					</option>
				))}
			</datalist>

			{locationError ? (
				<p className="text-rose text-xs font-semibold" role="alert">
					{locationError}
				</p>
			) : null}
			{locationNotice ? <p className="text-accent text-xs font-semibold">{locationNotice}</p> : null}

			<div className="flex flex-wrap items-center gap-2">
				<span className="bg-accent-soft text-accent inline-flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold">
					<CalendarClock className="size-4" aria-hidden="true" />
					Départ de démonstration · {catalog.search.departureAt.slice(11, 16)}
				</span>
				<span className="text-muted text-xs font-medium">Exemple disponible : Churchill → Gare</span>
			</div>

			<Button type="submit" size="large" className="w-full gap-2">
				<Search className="size-5" aria-hidden="true" />
				Rechercher un trajet
			</Button>
		</form>
	);
}
