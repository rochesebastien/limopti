import { ark } from '@ark-ui/react/factory';
import { type ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const card = tv({
	base: 'rounded-card border-border bg-surface border',
	variants: {
		padding: {
			none: '',
			small: 'p-4',
			medium: 'p-5',
			large: 'p-7',
		},
	},
	defaultVariants: {
		padding: 'medium',
	},
});

type CardVariants = VariantProps<typeof card>;

export interface CardProps extends ComponentPropsWithRef<typeof ark.div>, CardVariants {}

export function Card({ className, padding, ...props }: CardProps) {
	return <ark.div className={card({ className, padding })} {...props} />;
}
