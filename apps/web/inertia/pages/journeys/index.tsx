import { Head, router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Star } from 'lucide-react';
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

	return (
		<>
			<Head title="Itinéraires à Limoges">
				<meta name="description" content="Trajets bus et marche sur le réseau TCL de Limoges." />
			</Head>

			<main className="mx-auto w-full max-w-[1600px] md:grid md:h-[calc(100dvh-3.5rem)] md:grid-cols-[minmax(340px,400px)_1fr] md:overflow-hidden">
				<section className="bg-canvas md:border-border relative z-10 px-4 py-5 sm:px-5 md:overflow-y-auto md:border-r">
					<div className="mx-auto max-w-lg space-y-5">
						<h1 className="sr-only">Rechercher un itinéraire à Limoges</h1>

						<JourneySearchForm catalog={catalog} />

						{catalog.journeys.length ? (
							<section aria-label="Itinéraires proposés" className="space-y-2.5">
								<div className="flex items-center justify-between gap-3">
									<p className="text-muted text-xs tabular-nums">
										{catalog.journeys.length} itinéraire{catalog.journeys.length > 1 ? 's' : ''} ·{' '}
										{catalog.search.departureAt.slice(11, 16)}
									</p>
									<button
										type="button"
										onClick={toggleFavorite}
										className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
											favorite ? 'text-accent' : 'text-muted hover:text-ink'
										}`}
										aria-pressed={favorite}
									>
										<Star className={`size-3.5 ${favorite ? 'fill-current' : ''}`} aria-hidden="true" />
										{favorite ? 'Épinglé' : 'Épingler'}
									</button>
								</div>

								<p className="sr-only" aria-live="polite">
									{catalog.journeys.length} itinéraires entre {catalog.search.origin} et {catalog.search.destination}.
								</p>

								<div className="space-y-2">
									{catalog.journeys.map((journey) => (
										<JourneyCard
											key={journey.id}
											journey={journey}
											selected={selectedJourney?.id === journey.id}
											onSelect={() => setSelectedJourneyId(journey.id)}
										/>
									))}
								</div>
							</section>
						) : (
							<div className="border-border rounded-card border px-4 py-8 text-center">
								<p className="text-ink text-sm font-medium">Aucun itinéraire pour cette recherche</p>
								<p className="text-muted mx-auto mt-1.5 max-w-xs text-xs leading-5">
									Le calculateur complet n’est pas encore branché. Seul le trajet de démonstration est disponible.
								</p>
								<Button
									intent="secondary"
									size="small"
									className="mt-4"
									onClick={() => router.get('/', { from: 'Pl. W. Churchill', to: 'Gare des Bénédictins' })}
								>
									Charger Churchill → Gare
								</Button>
							</div>
						)}

						<DemoBanner className="pt-1" />
					</div>
				</section>

				<LimoptiMap
					key={`${catalog.search.origin}-${catalog.search.destination}-${selectedJourney?.id ?? 'none'}`}
					catalog={catalog}
					showJourneyRoute={selectedJourney?.legs.some((leg) => leg.mode === 'bus') ?? false}
					className="border-border h-[46dvh] min-h-72 border-t md:h-full md:min-h-0 md:border-t-0"
				/>
			</main>
		</>
	);
}
