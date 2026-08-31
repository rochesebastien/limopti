import { Head } from '@inertiajs/react';
import { Card } from '@limopti/design-system/card';
import { Input } from '@limopti/design-system/input';
import { ArrowRight, BusFront, Search, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DemoBanner } from '~/components/mobility/demo_banner';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

export default function LinesIndex({ catalog }: PageProps) {
	const [query, setQuery] = useState('');
	const [expandedLineId, setExpandedLineId] = useState<string>();
	const filteredLines = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase('fr');

		if (!normalized) {
			return catalog.lines;
		}

		return catalog.lines.filter((line) =>
			`${line.shortName} ${line.name}`.toLocaleLowerCase('fr').includes(normalized),
		);
	}, [catalog.lines, query]);

	return (
		<>
			<Head title="Lignes TCL" />
			<main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="border-border grid gap-6 border-b pb-7 md:grid-cols-[1fr_340px] md:items-end">
					<div>
						<p className="text-accent text-xs font-black tracking-[0.16em] uppercase">Réseau TCL</p>
						<h1 className="text-ink mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Toutes les lignes TCL</h1>
						<p className="text-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base">
							Explorez les {catalog.lines.length} lignes du flux GTFS officiel en vigueur, avec leurs terminus et leurs
							couleurs réseau.
						</p>
					</div>

					<div className="relative">
						<label className="sr-only" htmlFor="line-search">
							Rechercher une ligne
						</label>
						<Search className="text-muted absolute top-1/2 left-3.5 size-4 -translate-y-1/2" aria-hidden="true" />
						<Input
							id="line-search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Numéro, terminus…"
							inputSize="large"
							className="pl-10"
						/>
					</div>
				</header>

				<div className="mt-6">
					<DemoBanner />
				</div>

				<section className="mt-7" aria-labelledby="line-list-title">
					<div className="mb-4 flex items-center justify-between">
						<h2 id="line-list-title" className="text-ink text-lg font-black">
							{filteredLines.length} lignes affichées
						</h2>
						<span className="text-muted text-xs">Catalogue GTFS complet · 11 août 2026</span>
					</div>

					{filteredLines.length ? (
						<div className="grid gap-3 md:grid-cols-2">
							{filteredLines.map((line) => (
								<Card key={line.id} padding="none" className="group hover:border-accent/40 overflow-hidden">
									<article className="flex h-full flex-col">
										<div className="flex min-w-0 flex-1 items-stretch">
											<div className="flex min-w-0 flex-1 gap-4 p-4 sm:p-5">
												<LineBadge name={line.shortName} color={line.color} textColor={line.textColor} />
												<div className="min-w-0">
													<h3 className="text-ink leading-5 font-bold">{line.name}</h3>
													<div className="mt-3 flex flex-wrap items-center gap-2">
														{line.status === 'disrupted' ? (
															<span className="bg-warning-soft text-warning inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.68rem] font-bold">
																<TriangleAlert className="size-3" aria-hidden="true" />
																Exemple de perturbation
															</span>
														) : (
															<span className="bg-mint-soft text-mint inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.68rem] font-bold">
																<span className="bg-mint size-1.5 rounded-full" />
																Service théorique normal
															</span>
														)}
														<span className="text-muted text-[0.68rem] font-semibold">GTFS TCL</span>
													</div>
												</div>
											</div>
											<button
												type="button"
												onClick={() => setExpandedLineId(expandedLineId === line.id ? undefined : line.id)}
												className="border-border text-muted group-hover:bg-accent-soft group-hover:text-accent grid w-12 shrink-0 place-items-center border-l transition-colors"
												aria-label={`${expandedLineId === line.id ? 'Masquer' : 'Afficher'} le détail de la ligne ${line.shortName}`}
												aria-expanded={expandedLineId === line.id}
											>
												<ArrowRight
													className={`size-4 transition-transform ${expandedLineId === line.id ? 'rotate-90' : ''}`}
													aria-hidden="true"
												/>
											</button>
										</div>
										{expandedLineId === line.id ? (
											<div className="border-border bg-surface-muted/50 grid gap-3 border-t p-4 text-xs sm:grid-cols-3 sm:p-5">
												<div>
													<p className="text-muted font-semibold">Horaires</p>
													<p className="text-ink mt-1 font-black">Théoriques uniquement</p>
												</div>
												<div>
													<p className="text-muted font-semibold">Accessibilité</p>
													<p className="text-ink mt-1 font-black">Selon le véhicule</p>
												</div>
												<div>
													<p className="text-muted font-semibold">Prochain passage</p>
													<p className="text-warning mt-1 font-black">Non calculé dans ce prototype</p>
												</div>
											</div>
										) : null}
									</article>
								</Card>
							))}
						</div>
					) : (
						<Card className="grid place-items-center py-14 text-center">
							<BusFront className="text-muted size-8" aria-hidden="true" />
							<h3 className="text-ink mt-4 font-bold">Aucune ligne trouvée</h3>
							<p className="text-muted mt-1 text-sm">Essayez un numéro ou le nom d’un terminus.</p>
						</Card>
					)}
				</section>
			</main>
		</>
	);
}
