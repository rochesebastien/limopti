import { Link } from '@adonisjs/inertia/react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { ArrowRight, Trash2 } from 'lucide-react';
import { useFavorites } from '~/components/favorite/use_favorites';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

export default function FavoritesIndex({ catalog }: PageProps) {
	const { favorites, add, remove } = useFavorites();

	function addExample() {
		add({
			id: 'pl. w. churchill::gare des bénédictins',
			label: 'Churchill → Gare',
			origin: 'Pl. W. Churchill',
			destination: 'Gare des Bénédictins',
			preferredLine: '6',
		});
	}

	return (
		<>
			<Head title="Favoris" />
			<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
				<header className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-ink text-xl font-semibold">Favoris</h1>
						<p className="text-muted mt-1 text-sm">Recalculés à chaque ouverture.</p>
					</div>
					<Button asChild intent="secondary" size="small">
						<Link route="home">Nouveau trajet</Link>
					</Button>
				</header>

				{favorites.length ? (
					<section className="border-border rounded-card mt-6 divide-y divide-[var(--color-border)] border">
						{favorites.map((favorite) => {
							const line = catalog.lines.find((item) => item.shortName === favorite.preferredLine);

							return (
								<article key={favorite.id} className="flex items-center gap-3 px-4 py-3.5">
									<div className="min-w-0 flex-1">
										<h2 className="text-ink truncate text-sm font-medium">{favorite.label}</h2>
										<p className="text-muted mt-0.5 truncate text-xs">
											{favorite.origin} → {favorite.destination}
										</p>
									</div>

									{line ? (
										<LineBadge name={line.shortName} color={line.color} textColor={line.textColor} size="small" />
									) : null}

									<button
										type="button"
										onClick={() => router.get('/', { from: favorite.origin, to: favorite.destination })}
										className="text-muted hover:text-ink inline-flex items-center gap-1 text-xs transition-colors"
									>
										Voir
										<ArrowRight className="size-3.5" aria-hidden="true" />
									</button>
									<button
										type="button"
										onClick={() => remove(favorite.id)}
										className="text-faint hover:text-critical grid size-7 shrink-0 place-items-center rounded-md transition-colors"
										aria-label={`Supprimer ${favorite.label}`}
									>
										<Trash2 className="size-3.5" aria-hidden="true" />
									</button>
								</article>
							);
						})}
					</section>
				) : (
					<div className="border-border rounded-card mt-6 border px-4 py-12 text-center">
						<p className="text-ink text-sm font-medium">Aucun trajet épinglé</p>
						<p className="text-muted mx-auto mt-1.5 max-w-xs text-xs leading-5">
							Épinglez un trajet depuis la recherche pour le retrouver ici.
						</p>
						<Button intent="secondary" size="small" className="mt-4" onClick={addExample}>
							Ajouter Churchill → Gare
						</Button>
					</div>
				)}
			</main>
		</>
	);
}
