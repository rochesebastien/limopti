import { Head } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

const STATUS = {
	connected: { label: 'Connectée', text: 'text-positive', dot: 'bg-positive' },
	prototype: { label: 'Prototype', text: 'text-warning', dot: 'bg-warning' },
	planned: { label: 'À obtenir', text: 'text-muted', dot: 'bg-faint' },
};

function formatDate(value: string) {
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'Europe/Paris',
	}).format(new Date(value));
}

export default function SourcesIndex({ catalog }: PageProps) {
	return (
		<>
			<Head title="Sources" />
			<main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
				<header>
					<h1 className="text-ink text-xl font-semibold">Sources</h1>
					<p className="text-muted mt-1 max-w-xl text-sm leading-6">
						Origine, licence et limites de chaque donnée. Une donnée théorique n’est jamais présentée comme du temps
						réel.
					</p>
				</header>

				<dl className="border-border rounded-card mt-6 grid gap-px overflow-hidden border bg-[var(--color-border)] sm:grid-cols-3">
					<div className="bg-surface px-4 py-3">
						<dt className="text-muted text-xs">Jeu principal</dt>
						<dd className="text-ink mt-1 text-sm font-medium">{catalog.meta.feedName}</dd>
					</div>
					<div className="bg-surface px-4 py-3">
						<dt className="text-muted text-xs">Validité</dt>
						<dd className="text-ink mt-1 text-sm font-medium">{formatDate(catalog.meta.feedValidUntil)}</dd>
					</div>
					<div className="bg-surface px-4 py-3">
						<dt className="text-muted text-xs">Temps réel TCL</dt>
						<dd className="text-ink mt-1 text-sm font-medium">Non disponible</dd>
					</div>
				</dl>

				<section className="mt-8 space-y-3" aria-label="Catalogue des sources">
					{catalog.sources.map((source) => {
						const status = STATUS[source.status];

						return (
							<article key={source.id} className="border-border rounded-card border px-4 py-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<h2 className="text-ink text-sm font-medium">{source.name}</h2>
										<p className="text-muted mt-0.5 text-xs">
											{source.provider} · {source.license}
										</p>
									</div>
									<span className={`${status.text} inline-flex shrink-0 items-center gap-1.5 text-xs`}>
										<span className={`${status.dot} size-1.5 rounded-full`} aria-hidden="true" />
										{status.label}
									</span>
								</div>

								<p className="text-ink-soft mt-3 text-xs leading-5">{source.usage}</p>
								<p className="text-muted mt-1.5 text-xs leading-5">Limite : {source.limitation}</p>

								<div className="text-faint mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
									{source.updatedAt ? <span>Archive {formatDate(source.updatedAt)}</span> : null}
									{source.validUntil ? <span>Valable jusqu’au {formatDate(source.validUntil)}</span> : null}
									<a
										href={source.url}
										target="_blank"
										rel="noreferrer"
										className="text-ink ml-auto inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"
									>
										Source officielle
										<ArrowUpRight className="size-3" aria-hidden="true" />
									</a>
								</div>
							</article>
						);
					})}
				</section>
			</main>
		</>
	);
}
