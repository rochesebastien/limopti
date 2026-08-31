import { authEnabled } from '#app/features';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		/**
		 * While the account area is switched off there is nobody to resolve, and
		 * skipping the lookup keeps the open-access application free of any
		 * database round-trip.
		 */
		if (authEnabled) {
			await ctx.auth.check();
		}

		return next();
	}
}
