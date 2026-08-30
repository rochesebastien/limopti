import { Link } from '@adonisjs/inertia/react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@limopti/design-system/button';
import { Card } from '@limopti/design-system/card';
import { ArrowRight, Clock3, MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { useFavorites } from '~/components/favorite/use_favorites';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

export default function FavoritesIndex({ catalog }: PageProps) {
	const { favorites, add, remove } = useFavorites();
	const lineSix = catalog.lines.find((line) => line.shortName === '6');

	function addExample() {
		add({
			id: 'pl. w. churchill::gare des bénédictins',
			label: 'Churchill → Gare',
			origin: 'Pl. W. Churchill',
			destination: 'Gare des Bénédictins',
			preferredLine: '6',
		});
	}

	function relaunch(origin: string, destination: string) {
		router.get('/', { from: origin, to: destination });
	}

	return (
		<>
			<Head title="Mes favoris" />
			<main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-accent text-xs font-black tracking-[0.16em] uppercase">Raccourcis personnels</p>
						<h1 className="text-ink mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Mes trajets épinglés</h1>
						<p className="text-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
							Limopti recalcule le meilleur trajet à chaque ouverture, avec les données disponibles à cet instant.
						</p>
					</div>
					<Button asChild size="large" className="gap-2 sm:w-auto">
						<Link route="home">
							<Plus className="size-4" aria-hidden="true" />
							Nouveau trajet
						</Link>
					</Button>
				</header>

				<section className="mt-8" aria-label="Trajets favoris">
					{favorites.length ? (
						<div className="grid gap-4 md:grid-cols-2">
							{favorites.map((favorite) => {
								const line = catalog.lines.find((item) => item.shortName === favorite.preferredLine);
								return (
									<Card key={favorite.id} padding="none" className="overflow-hidden">
										<article>
											<div className="flex items-start justify-between gap-3 p-5">
												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<span className="bg-brand-lime-soft text-accent grid size-8 place-items-center rounded-xl">
															<Star className="size-4 fill-current" aria-hidden="true" />
														</span>
														<h2 className="text-ink truncate font-black">{favorite.label}</h2>
													</div>
													<div className="text-muted mt-4 space-y-2 text-sm">
														<p className="flex items-center gap-2">
															<span className="bg-brand-lime size-2 rounded-full" />
															{favorite.origin}
														</p>
														<p className="flex items-center gap-2">
															<MapPin className="text-accent size-4" aria-hidden="true" />
															{favorite.destination}
														</p>
													</div>
												</div>
												<button
													type="button"
													onClick={() => remove(favorite.id)}
													className="text-muted hover:bg-rose-soft hover:text-rose grid size-9 shrink-0 place-items-center rounded-xl transition-colors"
													aria-label={`Supprimer le favori ${favorite.label}`}
												>
													<Trash2 className="size-4" aria-hidden="true" />
												</button>
											</div>

											<div className="border-border bg-surface-muted/50 flex items-center justify-between gap-3 border-t px-5 py-4">
												<div className="flex items-center gap-2">
													{line ? (
														<LineBadge
															name={line.shortName}
															color={line.color}
															textColor={line.textColor}
															size="small"
														/>
													) : null}
													<span className="text-muted inline-flex items-center gap-1 text-xs font-semibold">
														<Clock3 className="size-3" aria-hidden="true" />
														À recalculer
													</span>
												</div>
												<Button
													size="small"
													intent="secondary"
													className="gap-1.5"
													onClick={() => relaunch(favorite.origin, favorite.destination)}
												>
													Voir
													<ArrowRight className="size-3.5" aria-hidden="true" />
												</Button>
											</div>
										</article>
									</Card>
								);
							})}
						</div>
					) : (
						<Card className="mx-auto max-w-2xl py-12 text-center sm:py-16">
							<span className="bg-brand-lime-soft text-accent mx-auto grid size-14 place-items-center rounded-2xl">
								<Star className="size-6" aria-hidden="true" />
							</span>
							<h2 className="text-ink mt-5 text-xl font-black">Aucun trajet épinglé</h2>
							<p className="text-muted mx-auto mt-2 max-w-md text-sm leading-6">
								Épinglez vos déplacements récurrents. Leur itinéraire sera recalculé plutôt que figé sur une ancienne
								course.
							</p>
							<Button onClick={addExample} className="mt-6 gap-2">
								<Plus className="size-4" aria-hidden="true" />
								Ajouter Churchill → Gare
							</Button>
							{lineSix ? (
								<p className="text-muted mt-4 text-xs">
									Suggestion basée sur la ligne <LineBadge name="6" color={lineSix.color} size="small" />
								</p>
							) : null}
						</Card>
					)}
				</section>
			</main>
		</>
	);
}
