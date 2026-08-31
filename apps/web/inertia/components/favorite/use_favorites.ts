import { useCallback, useEffect, useState } from 'react';

const storageKey = 'limopti:favorites:v1';

export interface FavoriteIntent {
	id: string;
	label: string;
	origin: string;
	destination: string;
	preferredLine?: string;
	createdAt: string;
}

function isFavoriteIntent(value: unknown): value is FavoriteIntent {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return (
		typeof candidate.id === 'string' &&
		typeof candidate.label === 'string' &&
		typeof candidate.origin === 'string' &&
		typeof candidate.destination === 'string' &&
		typeof candidate.createdAt === 'string' &&
		(candidate.preferredLine === undefined || typeof candidate.preferredLine === 'string')
	);
}

function readFavorites(): FavoriteIntent[] {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		const value = window.localStorage.getItem(storageKey);
		const parsed: unknown = value ? JSON.parse(value) : [];

		return Array.isArray(parsed) ? parsed.filter(isFavoriteIntent) : [];
	} catch {
		return [];
	}
}

export function useFavorites() {
	const [favorites, setFavorites] = useState<FavoriteIntent[]>([]);

	useEffect(() => {
		setFavorites(readFavorites());
	}, []);

	const persist = useCallback((next: FavoriteIntent[]) => {
		setFavorites(next);
		window.localStorage.setItem(storageKey, JSON.stringify(next));
	}, []);

	const add = useCallback(
		(favorite: Omit<FavoriteIntent, 'createdAt'>) => {
			const current = readFavorites();

			if (current.some((item) => item.id === favorite.id)) {
				return;
			}

			persist([...current, { ...favorite, createdAt: new Date().toISOString() }]);
		},
		[persist],
	);

	const remove = useCallback(
		(id: string) => {
			persist(readFavorites().filter((favorite) => favorite.id !== id));
		},
		[persist],
	);

	return {
		favorites,
		add,
		remove,
		isFavorite: (id: string) => favorites.some((favorite) => favorite.id === id),
	};
}
