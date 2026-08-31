import { Head } from '@inertiajs/react';
import { LimoptiMap } from '~/components/map/limopti_map';
import { DemoBanner } from '~/components/mobility/demo_banner';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

function formatDateTime(value: string) {
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Paris',
	}).format(new Date(value));
}

export default function TrafficIndex({ catalog }: PageProps) {
	return (
		<>
			<Head title="Trafic" />
			<main className="mx-auto w-full max-w-[1600px] md:grid md:h-[calc(100dvh-3.5rem)] md:grid-cols-[minmax(340px,420px)_1fr] md:overflow-hidden">
				<section className="bg-canvas md:border-border relative z-10 px-4 py-6 sm:px-5 md:overflow-y-auto md:border-r">
					<div className="mx-auto max-w-lg space-y-6">
						<header>
							<h1 className="text-ink text-xl font-semibold">Trafic</h1>
							<p className="text-muted mt-1 text-sm">Perturbations TCL et circulation routière.</p>
						</header>

						<section aria-labelledby="transit-alerts-title" className="space-y-2.5">
							<h2 id="transit-alerts-title" className="text-muted text-xs font-medium">
								Transports en commun
							</h2>

							{catalog.disruptions.map((disruption) => (
								<article key={disruption.id} className="border-border rounded-card border px-4 py-3.5">
									<div className="flex flex-wrap items-center gap-2">
										{disruption.affectedLines.map((line) => (
											<LineBadge key={line} name={line} color="#FFDD00" textColor="#000000" size="small" />
										))}
										<span className="text-warning inline-flex items-center gap-1.5 text-xs">
											<span className="bg-warning size-1.5 rounded-full" aria-hidden="true" />
											En cours
										</span>
									</div>

									<h3 className="text-ink mt-2 text-sm font-medium">{disruption.title}</h3>
									<p className="text-muted mt-1 text-xs leading-5">{disruption.description}</p>
									<p className="text-faint mt-2.5 text-xs">
										Jusqu’au {formatDateTime(disruption.endsAt)} · {disruption.source}
									</p>
								</article>
							))}
						</section>

						<section aria-labelledby="road-traffic-title" className="space-y-2.5">
							<h2 id="road-traffic-title" className="text-muted text-xs font-medium">
								Circulation routière
							</h2>

							{catalog.traffic.map((event) => (
								<article key={event.id} className="border-border rounded-card border px-4 py-3.5">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<h3 className="text-ink text-sm font-medium">
												{event.road} · {event.section}
											</h3>
											<p className="text-critical mt-1 inline-flex items-center gap-1.5 text-xs">
												<span className="bg-critical size-1.5 rounded-full" aria-hidden="true" />
												Circulation difficile
											</p>
										</div>
										<span className="text-ink shrink-0 text-sm tabular-nums">+{event.delayMinutes} min</span>
									</div>
									<p className="text-faint mt-2.5 text-xs">
										{event.source} · {formatDateTime(event.updatedAt)}
									</p>
								</article>
							))}

							<p className="text-faint text-xs">
								Couverture limitée à l’A20 : pas de flux ouvert sur les rues urbaines.
							</p>
						</section>

						<DemoBanner />
					</div>
				</section>

				<LimoptiMap
					catalog={catalog}
					mode="traffic"
					className="border-border h-[46dvh] min-h-72 border-t md:h-full md:min-h-0 md:border-t-0"
				/>
			</main>
		</>
	);
}
