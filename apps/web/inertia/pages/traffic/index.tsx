import { Link } from '@adonisjs/inertia/react';
import { Head } from '@inertiajs/react';
import { Card } from '@limopti/design-system/card';
import { ArrowUpRight, Clock3, Construction, MapPinned, Route, ShieldAlert } from 'lucide-react';
import { LimoptiMap } from '~/components/map/limopti_map';
import { DemoBanner } from '~/components/mobility/demo_banner';
import { LineBadge } from '~/components/transit/line_badge';
import type { MobilityCatalog } from '~/mobility';
import type { InertiaProps } from '~/types';

type PageProps = InertiaProps<{ catalog: MobilityCatalog }>;

function formatDateTime(value: string) {
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'Europe/Paris',
	}).format(new Date(value));
}

export default function TrafficIndex({ catalog }: PageProps) {
	return (
		<>
			<Head title="Info trafic" />
			<main className="mx-auto w-full max-w-[1600px] md:grid md:h-[calc(100dvh-4rem)] md:grid-cols-[minmax(390px,480px)_1fr] md:overflow-hidden">
				<section className="bg-canvas md:border-border relative z-10 px-4 py-6 sm:px-6 md:overflow-y-auto md:border-r md:px-6 md:py-8">
					<div className="mx-auto max-w-xl">
						<header>
							<p className="text-accent text-xs font-black tracking-[0.16em] uppercase">État du réseau</p>
							<h1 className="text-ink mt-2 text-3xl font-black tracking-[-0.04em]">Info trafic</h1>
							<p className="text-muted mt-3 text-sm leading-6">
								Perturbations TCL et circulation routière, avec leur source et leur fraîcheur clairement affichées.
							</p>
						</header>

						<div className="mt-5">
							<DemoBanner />
						</div>

						<section className="mt-7" aria-labelledby="transit-alerts-title">
							<div className="mb-3 flex items-center justify-between">
								<h2 id="transit-alerts-title" className="text-ink text-lg font-black">
									Transports en commun
								</h2>
								<span className="bg-warning-soft text-warning rounded-lg px-2 py-1 text-[0.68rem] font-black">
									1 exemple
								</span>
							</div>

							{catalog.disruptions.map((disruption) => (
								<Card key={disruption.id} padding="none" className="overflow-hidden">
									<article>
										<div className="border-warning/20 bg-warning-soft flex items-start gap-3 border-b p-4">
											<span className="bg-warning grid size-9 shrink-0 place-items-center rounded-xl text-white">
												<Construction className="size-4" aria-hidden="true" />
											</span>
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-2">
													{disruption.affectedLines.map((line) => (
														<LineBadge key={line} name={line} color="#FFDD00" textColor="#000000" size="small" />
													))}
													<span className="text-warning text-[0.68rem] font-black tracking-wide uppercase">Active</span>
												</div>
												<h3 className="text-ink mt-2 font-black">{disruption.title}</h3>
											</div>
										</div>
										<div className="p-4">
											<p className="text-muted text-sm leading-6">{disruption.description}</p>
											<div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
												<p className="text-muted flex items-center gap-2">
													<Clock3 className="size-3.5" aria-hidden="true" />
													Jusqu’au {formatDateTime(disruption.endsAt)}
												</p>
												<p className="text-warning flex items-center gap-2 font-semibold">
													<MapPinned className="size-3.5" aria-hidden="true" />
													Tracé non disponible
												</p>
											</div>
											<p className="text-muted mt-4 text-[0.68rem] font-semibold">Source : {disruption.source}</p>
										</div>
									</article>
								</Card>
							))}
						</section>

						<section className="mt-8" aria-labelledby="road-traffic-title">
							<div className="mb-3 flex items-center justify-between">
								<h2 id="road-traffic-title" className="text-ink text-lg font-black">
									Circulation routière
								</h2>
								<span className="text-muted text-xs">A20 uniquement au prototype</span>
							</div>

							{catalog.traffic.map((event) => (
								<Card key={event.id} className="border-traffic-jam/20">
									<article className="flex items-start gap-4">
										<span className="bg-rose-soft text-traffic-jam grid size-10 shrink-0 place-items-center rounded-xl">
											<Route className="size-5" aria-hidden="true" />
										</span>
										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-3">
												<div>
													<p className="text-traffic-jam text-xs font-black tracking-wide uppercase">
														Circulation difficile
													</p>
													<h3 className="text-ink mt-1 font-black">
														{event.road} · {event.section}
													</h3>
												</div>
												<span className="bg-rose-soft text-traffic-jam rounded-xl px-2.5 py-1.5 text-sm font-black tabular-nums">
													+{event.delayMinutes} min
												</span>
											</div>
											<p className="text-muted mt-3 text-xs">
												Source : {event.source} · mise à jour {formatDateTime(event.updatedAt)}
											</p>
										</div>
									</article>
								</Card>
							))}

							<div className="mt-4 grid grid-cols-3 gap-2" aria-label="Légende de circulation">
								{[
									['bg-traffic-free', 'Fluide'],
									['bg-traffic-dense', 'Dense'],
									['bg-traffic-jam', 'Bouchon'],
								].map(([color, label]) => (
									<div
										key={label}
										className="border-border bg-surface flex items-center gap-2 rounded-xl border px-3 py-2 text-[0.68rem] font-bold"
									>
										<span className={`${color} h-1.5 w-5 rounded-full`} />
										{label}
									</div>
								))}
							</div>
						</section>

						<div className="border-border mt-8 border-t pt-6">
							<Link
								route="sources.index"
								className="text-accent inline-flex items-center gap-2 text-sm font-bold hover:underline"
							>
								Voir la couverture et les limites des données
								<ArrowUpRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</div>
				</section>

				<div className="relative">
					<LimoptiMap
						catalog={catalog}
						mode="traffic"
						className="border-border h-[52dvh] min-h-96 border-t md:h-full md:min-h-0 md:border-t-0"
					/>
					<div className="pointer-events-none absolute right-4 bottom-16 left-4 z-10 hidden md:block">
						<div className="bg-surface/95 shadow-panel ml-auto max-w-sm rounded-2xl p-4 backdrop-blur">
							<div className="flex items-start gap-3">
								<ShieldAlert className="text-warning mt-0.5 size-5 shrink-0" aria-hidden="true" />
								<div>
									<p className="text-ink text-sm font-black">Couverture partielle</p>
									<p className="text-muted mt-1 text-xs leading-5">
										Bison Futé couvre surtout l’A20. Les rues urbaines ne disposent pas encore d’un flux ouvert
										équivalent.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
