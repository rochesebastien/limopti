import { Head } from '@inertiajs/react';
import { Card } from '@limopti/design-system/card';
import { ArrowUpRight, CheckCircle2, CircleDashed, Database, FileWarning, Layers3, RadioTower } from 'lucide-react';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

const statusLabels = {
	connected: { label: 'Connectée au prototype', className: 'bg-mint-soft text-mint', icon: CheckCircle2 },
	prototype: { label: 'Prototype technique', className: 'bg-warning-soft text-warning', icon: CircleDashed },
	planned: { label: 'Accès à obtenir', className: 'bg-info-soft text-info', icon: RadioTower },
};

function formatDate(value: string) {
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'Europe/Paris',
	}).format(new Date(value));
}

export default function SourcesIndex({ catalog }: PageProps) {
	return (
		<>
			<Head title="Sources et qualité des données" />
			<main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="max-w-3xl">
					<p className="text-accent text-xs font-black tracking-[0.16em] uppercase">Transparence</p>
					<h1 className="text-ink mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
						Sources et qualité des données
					</h1>
					<p className="text-muted mt-4 text-sm leading-6 sm:text-base">
						Limopti affiche l’origine, la licence, la fraîcheur et les limites de chaque information. Une donnée
						théorique ou simulée n’est jamais présentée comme du temps réel.
					</p>
				</header>

				<section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="État général des données">
					<Card className="sm:col-span-1">
						<Database className="text-accent size-5" aria-hidden="true" />
						<p className="text-muted mt-4 text-xs font-bold tracking-wide uppercase">Jeu principal</p>
						<p className="text-ink mt-1 font-black">{catalog.meta.feedName}</p>
					</Card>
					<Card className="sm:col-span-1">
						<Layers3 className="text-info size-5" aria-hidden="true" />
						<p className="text-muted mt-4 text-xs font-bold tracking-wide uppercase">Validité connue</p>
						<p className="text-ink mt-1 font-black">Jusqu’au {formatDate(catalog.meta.feedValidUntil)}</p>
					</Card>
					<Card className="border-warning/25 bg-warning-soft sm:col-span-1">
						<FileWarning className="text-warning size-5" aria-hidden="true" />
						<p className="text-warning mt-4 text-xs font-bold tracking-wide uppercase">Temps réel TCL</p>
						<p className="text-ink mt-1 font-black">Non disponible en open data</p>
					</Card>
				</section>

				<section className="mt-10" aria-labelledby="source-list-title">
					<div className="mb-5">
						<h2 id="source-list-title" className="text-ink text-xl font-black">
							Catalogue des sources
						</h2>
						<p className="text-muted mt-1 text-sm">État d’intégration dans ce premier MVP.</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						{catalog.sources.map((source) => {
							const status = statusLabels[source.status];
							const StatusIcon = status.icon;

							return (
								<Card key={source.id} padding="none" className="overflow-hidden">
									<article className="flex h-full flex-col">
										<div className="flex-1 p-5 sm:p-6">
											<div className="flex flex-wrap items-center justify-between gap-2">
												<span
													className={`${status.className} inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.68rem] font-black`}
												>
													<StatusIcon className="size-3" aria-hidden="true" />
													{status.label}
												</span>
												<span className="border-border bg-surface-muted text-muted rounded-lg border px-2 py-1 text-[0.68rem] font-bold">
													{source.license}
												</span>
											</div>

											<h3 className="text-ink mt-4 text-lg font-black">{source.name}</h3>
											<p className="text-muted mt-1 text-xs font-semibold">{source.provider}</p>
											<p className="text-ink mt-4 text-sm leading-6">{source.usage}</p>

											<div className="bg-surface-muted mt-5 rounded-xl p-3">
												<p className="text-muted text-xs leading-5">
													<span className="text-ink font-black">Limite connue :</span> {source.limitation}
												</p>
											</div>

											{source.updatedAt || source.validUntil ? (
												<dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
													{source.updatedAt ? (
														<div>
															<dt className="text-muted">Dernière archive</dt>
															<dd className="text-ink mt-1 font-bold">{formatDate(source.updatedAt)}</dd>
														</div>
													) : null}
													{source.validUntil ? (
														<div>
															<dt className="text-muted">Valable jusqu’au</dt>
															<dd className="text-ink mt-1 font-bold">{formatDate(source.validUntil)}</dd>
														</div>
													) : null}
												</dl>
											) : null}
										</div>

										<a
											href={source.url}
											target="_blank"
											rel="noreferrer"
											className="border-border text-accent hover:bg-accent-soft flex items-center justify-between border-t px-5 py-4 text-sm font-bold transition-colors sm:px-6"
										>
											Consulter la source officielle
											<ArrowUpRight className="size-4" aria-hidden="true" />
										</a>
									</article>
								</Card>
							);
						})}
					</div>
				</section>

				<section
					className="border-border bg-brand-navy mt-10 overflow-hidden rounded-3xl border p-6 text-white sm:p-8"
					aria-labelledby="data-principles-title"
				>
					<div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
						<div>
							<p className="text-brand-lime text-xs font-black tracking-[0.16em] uppercase">Engagement produit</p>
							<h2 id="data-principles-title" className="mt-2 text-2xl font-black tracking-tight">
								Pas de fausse précision
							</h2>
							<p className="mt-3 text-sm leading-6 text-white/70">
								Une déviation sans géométrie reste textuelle. Une donnée ancienne reste datée. Un horaire théorique ne
								reçoit jamais une apparence de temps réel.
							</p>
						</div>
						<ul className="grid gap-3 text-sm sm:grid-cols-2">
							{[
								'Source visible sur chaque alerte',
								'Horodatage et validité conservés',
								'Confiance explicite pour le trafic',
								'Licences documentées et attribuées',
							].map((principle) => (
								<li key={principle} className="flex gap-2 rounded-xl bg-white/7 p-3 text-white/85">
									<CheckCircle2 className="text-brand-lime mt-0.5 size-4 shrink-0" aria-hidden="true" />
									{principle}
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>
		</>
	);
}
