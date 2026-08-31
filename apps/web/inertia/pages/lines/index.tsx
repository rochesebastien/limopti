import { Head } from '@inertiajs/react';
import { Input } from '@limopti/design-system/input';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DemoBanner } from '~/components/mobility/demo_banner';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

export default function LinesIndex({ catalog }: PageProps) {
	const [query, setQuery] = useState('');
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
			<main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-ink text-xl font-semibold">Lignes</h1>
						<p className="text-muted mt-1 text-sm tabular-nums">{catalog.lines.length} lignes du réseau TCL</p>
					</div>

					<div className="relative sm:w-64">
						<label className="sr-only" htmlFor="line-search">
							Rechercher une ligne
						</label>
						<Search className="text-faint absolute top-1/2 left-3 size-3.5 -translate-y-1/2" aria-hidden="true" />
						<Input
							id="line-search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Numéro ou terminus"
							className="pl-8"
						/>
					</div>
				</header>

				<section className="border-border rounded-card mt-6 divide-y divide-[var(--color-border)] border">
					{filteredLines.length ? (
						filteredLines.map((line) => (
							<article
								key={line.id}
								className="hover:bg-surface-muted flex items-center gap-3 px-4 py-3 transition-colors"
							>
								<LineBadge name={line.shortName} color={line.color} textColor={line.textColor} size="small" />
								<h2 className="text-ink min-w-0 flex-1 truncate text-sm">{line.name}</h2>
								{line.status === 'disrupted' ? (
									<span className="text-warning inline-flex shrink-0 items-center gap-1.5 text-xs">
										<span className="bg-warning size-1.5 rounded-full" aria-hidden="true" />
										Perturbée
									</span>
								) : null}
							</article>
						))
					) : (
						<p className="text-muted px-4 py-10 text-center text-sm">Aucune ligne ne correspond à « {query} ».</p>
					)}
				</section>

				<DemoBanner className="mt-4" />
			</main>
		</>
	);
}
