import { ark } from '@ark-ui/react/factory';
import { type ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
	base: 'rounded-control inline-flex cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-40',
	variants: {
		intent: {
			primary: 'bg-solid text-solid-ink hover:bg-solid-hover',
			secondary: 'border-border bg-surface text-ink hover:bg-surface-muted hover:border-border-strong border',
			ghost: 'text-muted hover:bg-surface-muted hover:text-ink',
		},
		size: {
			small: 'h-8 px-3 text-[0.8125rem]',
			medium: 'h-9 px-3.5 text-sm',
			large: 'h-11 px-4 text-sm',
		},
	},
	defaultVariants: {
		intent: 'primary',
		size: 'medium',
	},
});

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends ComponentPropsWithRef<typeof ark.button>, ButtonVariants {
	loading?: boolean;
}

export function Button({
	asChild,
	children,
	className,
	disabled,
	intent,
	loading = false,
	size,
	type,
	...props
}: ButtonProps) {
	if (asChild) {
		return (
			<ark.button asChild className={button({ intent, size, className })} {...props}>
				{children}
			</ark.button>
		);
	}

	return (
		<ark.button
			type={type ?? 'button'}
			aria-busy={loading || undefined}
			disabled={disabled || loading}
			className={button({ intent, size, className })}
			{...props}
		>
			{loading && (
				<span
					aria-hidden="true"
					className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
				/>
			)}
			{children}
		</ark.button>
	);
}
