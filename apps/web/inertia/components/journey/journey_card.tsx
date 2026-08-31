import { BusFront, ChevronDown, Footprints } from 'lucide-react';
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
		<article
			className={`rounded-card overflow-hidden border transition-colors ${
				selected ? 'border-ink' : 'border-border hover:border-border-strong'
			}`}
		>
			<button
				type="button"
				onClick={onSelect}
				className="w-full px-4 py-3.5 text-left"
				aria-expanded={selected}
				aria-label={`Itinéraire de ${journey.departure} à ${journey.arrival}, ${journey.durationMinutes} minutes`}
			>
				<div className="flex items-center justify-between gap-3">
					<div className="min-w-0">
						<p className="text-faint text-xs">{journey.label}</p>

						<div className="mt-0.5 flex items-baseline gap-2 whitespace-nowrap">
							<span className="text-ink text-base font-medium tabular-nums">
								{journey.departure}
								<span className="text-faint mx-1.5 font-normal">→</span>
								{journey.arrival}
							</span>
							<span className="text-muted text-sm tabular-nums">{journey.durationMinutes} min</span>
						</div>

						<div className="mt-2 flex items-center gap-1.5">
							{busLeg?.line ? (
								<>
									<LineBadge name={busLeg.line} color={busLeg.color ?? '#e2620b'} size="small" />
									<span className="text-muted truncate text-xs">
										vers {busLeg.headsign} · {journey.walkingMinutes} min à pied
									</span>
								</>
							) : (
								<span className="text-muted inline-flex items-center gap-1.5 truncate text-xs">
									<Footprints className="size-3.5 shrink-0" aria-hidden="true" />
									Marche uniquement · 1,4 km
								</span>
							)}
						</div>
					</div>

					<ChevronDown
						className={`text-faint size-4 shrink-0 transition-transform ${selected ? 'rotate-180' : ''}`}
						aria-hidden="true"
					/>
				</div>
			</button>

			{selected ? (
				<div className="border-border border-t px-4 py-3.5">
					<ol className="space-y-0" aria-label="Étapes du trajet">
						{journey.legs.map((leg, index) => (
							<li key={leg.id} className="relative flex gap-3 pb-3.5 last:pb-0">
								{index < journey.legs.length - 1 ? (
									<span className="bg-border absolute top-6 bottom-0 left-[0.6875rem] w-px" aria-hidden="true" />
								) : null}
								<span
									className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full ${
										leg.mode === 'bus' ? 'bg-ink text-canvas' : 'border-border bg-surface text-muted border'
									}`}
								>
									{leg.mode === 'bus' ? <BusFront className="size-3" /> : <Footprints className="size-3" />}
								</span>
								<div className="min-w-0 pt-0.5">
									<p className="text-ink text-xs">
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

					{journey.theoretical ? (
						<p className="text-faint border-border mt-1 border-t pt-3 text-xs">
							Horaire théorique · accessibilité à confirmer
						</p>
					) : null}
				</div>
			) : null}
		</article>
	);
}
