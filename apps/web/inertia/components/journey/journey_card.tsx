import { Card } from '@limopti/design-system/card';
import { Accessibility, BusFront, ChevronDown, Clock3, Footprints } from 'lucide-react';
import { LineBadge } from '~/components/transit/line_badge';
import type { Journey } from '~/mobility';

export interface JourneyCardProps {
	journey: Journey;
	selected: boolean;
	onSelect: () => void;
}

export function JourneyCard({ journey, selected, onSelect }: JourneyCardProps) {
	const busLeg = journey.legs.find((leg) => leg.mode === 'bus');

	return (
		<Card
			padding="none"
			className={`overflow-hidden transition-all ${selected ? 'border-accent ring-accent/15 shadow-panel ring-4' : 'hover:border-accent/40'}`}
		>
			<article>
				<div>
					<button type="button" onClick={onSelect} className="w-full p-4 text-left sm:p-5" aria-expanded={selected}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<span className="text-accent text-xs font-black tracking-wide uppercase">{journey.label}</span>
								<div className="mt-1 flex items-baseline gap-2">
									<span className="text-ink text-xl font-black tracking-tight tabular-nums">
										{journey.departure} <span className="text-muted font-medium">→</span> {journey.arrival}
									</span>
									<span className="text-muted text-sm font-semibold">{journey.durationMinutes} min</span>
								</div>
							</div>
							<ChevronDown
								className={`text-muted mt-1 size-5 shrink-0 transition-transform ${selected ? 'rotate-180' : ''}`}
								aria-hidden="true"
							/>
						</div>

						<div className="mt-4 flex flex-wrap items-center gap-2">
							{busLeg?.line ? (
								<>
									<Footprints className="text-muted size-4" aria-label="Marche" />
									<span className="text-muted text-xs font-bold">{journey.walkingMinutes} min</span>
									<span className="text-border" aria-hidden="true">
										•
									</span>
									<LineBadge name={busLeg.line} color={busLeg.color ?? '#F97316'} size="small" />
									<span className="text-ink text-xs font-bold">vers {busLeg.headsign}</span>
								</>
							) : (
								<>
									<Footprints className="text-accent size-4" aria-hidden="true" />
									<span className="text-ink text-xs font-bold">Marche uniquement · 1,4 km</span>
								</>
							)}
						</div>

						<div className="mt-3 flex flex-wrap gap-2">
							{journey.theoretical ? (
								<span className="bg-warning-soft text-warning inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.68rem] font-bold">
									<Clock3 className="size-3" aria-hidden="true" />
									Horaire théorique
								</span>
							) : null}
							{journey.accessible ? (
								<span className="bg-info-soft text-info inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.68rem] font-bold">
									<Accessibility className="size-3" aria-hidden="true" />
									Accessibilité à confirmer
								</span>
							) : null}
						</div>
					</button>
				</div>

				{selected ? (
					<div className="border-border bg-surface-muted/55 border-t px-4 py-4 sm:px-5">
						<ol className="space-y-0" aria-label="Étapes du trajet">
							{journey.legs.map((leg, index) => (
								<li key={leg.id} className="relative flex gap-3 pb-4 last:pb-0">
									{index < journey.legs.length - 1 ? (
										<span
											className="border-border absolute top-7 bottom-0 left-[0.9rem] border-l-2 border-dotted"
											aria-hidden="true"
										/>
									) : null}
									<span
										className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full ${
											leg.mode === 'bus' ? 'bg-accent text-white' : 'border-border bg-surface text-muted border'
										}`}
									>
										{leg.mode === 'bus' ? <BusFront className="size-3.5" /> : <Footprints className="size-3.5" />}
									</span>
									<div className="min-w-0 pt-0.5">
										<p className="text-ink text-xs font-bold">
											{leg.mode === 'bus'
												? `Ligne ${leg.line} · ${leg.departure} → ${leg.arrival}`
												: `${leg.durationMinutes} min de marche`}
										</p>
										<p className="text-muted mt-0.5 text-xs">
											{leg.from} → {leg.to}
										</p>
									</div>
								</li>
							))}
						</ol>
					</div>
				) : null}
			</article>
		</Card>
	);
}
