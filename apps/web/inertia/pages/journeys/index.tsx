import { Link } from '@adonisjs/inertia/react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Card } from '@limopti/design-system/card';
import { ArrowRight, Info, MapPin, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '~/components/favorite/use_favorites';
import { JourneyCard } from '~/components/journey/journey_card';
import { JourneySearchForm } from '~/components/journey/journey_search_form';
import { LimoptiMap } from '~/components/map/limopti_map';
import { DemoBanner } from '~/components/mobility/demo_banner';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

export default function JourneyPlanner({ catalog }: PageProps) {
	const [selectedJourneyId, setSelectedJourneyId] = useState(catalog.journeys[0]?.id);
	const { add, remove, isFavorite } = useFavorites();
	const selectedJourney = catalog.journeys.find((item) => item.id === selectedJourneyId) ?? catalog.journeys[0];
	const favoriteId = `${catalog.search.origin}::${catalog.search.destination}`.toLocaleLowerCase('fr');
	const favorite = isFavorite(favoriteId);
	const departureLabel = new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Paris',
	}).format(new Date(catalog.search.departureAt));

	function toggleFavorite() {
		if (!selectedJourney) {
			return;
		}

		if (favorite) {
			remove(favoriteId);
			return;
		}

		add({
			id: favoriteId,
			label: `${catalog.search.origin} → ${catalog.search.destination}`,
			origin: catalog.search.origin,
			destination: catalog.search.destination,
			preferredLine: selectedJourney.legs.find((leg) => leg.mode === 'bus')?.line,
		});
	}

	function loadDemoJourney() {
		router.get('/', { from: 'Pl. W. Churchill', to: 'Gare des Bénédictins' });
	}

	return (
		<>
			<Head title="Itinéraires à Limoges">
				<meta
					name="description"
					content="Comparez vos trajets en bus et à pied sur le réseau TCL de Limoges Métropole."
				/>
			</Head>

			<main className="mx-auto w-full max-w-[1600px] md:grid md:h-[calc(100dvh-4rem)] md:grid-cols-[minmax(370px,440px)_1fr] md:overflow-hidden">
				<section className="bg-canvas md:border-border relative z-10 px-4 py-5 sm:px-6 md:overflow-y-auto md:border-r md:px-5 md:py-6">
					<div className="mx-auto max-w-xl space-y-5">
						<header>
							<div className="flex items-center gap-2">
								<span className="bg-brand-lime-soft text-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-black tracking-wide uppercase">
									<Sparkles className="size-3" aria-hidden="true" />
									Mobilité simplifiée
								</span>
							</div>
							<h1 className="text-ink mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
								Où allez-vous&nbsp;?
							</h1>
							<p className="text-muted mt-1.5 text-sm">Bus, marche et état du réseau dans une seule recherche.</p>
						</header>

						<DemoBanner compact />
						<JourneySearchForm catalog={catalog} />

						<div className="border-border border-t pt-5">
							<div className="mb-3 flex items-end justify-between gap-3">
								<div>
									<h2 className="text-ink text-lg font-black">
										{catalog.journeys.length} itinéraire{catalog.journeys.length > 1 ? 's' : ''} trouvé
										{catalog.journeys.length > 1 ? 's' : ''}
									</h2>
									<p className="text-muted mt-0.5 text-xs capitalize">{departureLabel} · heure de démonstration</p>
								</div>
								{selectedJourney ? (
									<button
										type="button"
										onClick={toggleFavorite}
										className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-colors ${
											favorite ? 'bg-brand-lime-soft text-accent' : 'bg-surface-muted text-muted hover:text-accent'
										}`}
										aria-pressed={favorite}
									>
										<Star className={`size-4 ${favorite ? 'fill-current' : ''}`} aria-hidden="true" />
										{favorite ? 'Épinglé' : 'Épingler la recherche'}
									</button>
								) : null}
							</div>

							<p className="sr-only" aria-live="polite">
								{catalog.journeys.length} itinéraires trouvés entre {catalog.search.origin} et{' '}
								{catalog.search.destination}.
							</p>

							{catalog.journeys.length ? (
								<div className="space-y-3">
									{catalog.journeys.map((journey) => (
										<JourneyCard
											key={journey.id}
											journey={journey}
											selected={selectedJourney?.id === journey.id}
											onSelect={() => setSelectedJourneyId(journey.id)}
										/>
									))}
								</div>
							) : (
								<Card className="py-9 text-center">
									<MapPin className="text-accent mx-auto size-7" aria-hidden="true" />
									<h3 className="text-ink mt-4 font-black">Trajet hors du scénario de démonstration</h3>
									<p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-6">
										Le calculateur complet n’est pas encore branché. Aucun itinéraire fictif n’est affiché pour cette
										recherche.
									</p>
									<Button onClick={loadDemoJourney} intent="secondary" className="mt-5">
										Charger l’exemple Churchill → Gare
									</Button>
								</Card>
							)}
						</div>

						<div className="bg-info-soft text-info flex gap-3 rounded-2xl p-4 text-xs leading-5">
							<Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
							<p>
								Les horaires sont issus du GTFS TCL. Limopti affichera automatiquement les retards et déviations dès
								qu’un flux opérateur officiel sera disponible.
							</p>
						</div>

						<Link
							route="sources.index"
							className="text-muted hover:text-accent flex items-center justify-between rounded-xl py-2 text-xs font-semibold transition-colors"
						>
							Comprendre les données utilisées
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>
				</section>

				<LimoptiMap
					key={`${catalog.search.origin}-${catalog.search.destination}-${selectedJourney?.id ?? 'none'}`}
					catalog={catalog}
					showJourneyRoute={selectedJourney?.legs.some((leg) => leg.mode === 'bus') ?? false}
					className="border-border h-[46dvh] min-h-80 border-t md:h-full md:min-h-0 md:border-t-0"
				/>
			</main>
		</>
	);
}
