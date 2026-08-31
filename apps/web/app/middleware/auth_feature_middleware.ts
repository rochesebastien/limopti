import { authEnabled } from '#app/features';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * Keeps the identity routes registered — so route names and generated types stay
 * stable — while sending visitors back to the planner for as long as the account
 * area is switched off.
 */
export default class AuthFeatureMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		if (!authEnabled) {
			return ctx.response.redirect('/', true);
		}

		return next();
	}
}
