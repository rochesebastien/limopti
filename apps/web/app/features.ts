import env from '#start/env';

/**
 * Limopti is currently published in open access: the planner, lines, favorites,
 * traffic and sources pages are all reachable without an account.
 *
 * The identity code (login, signup, account) is kept intact and simply gated
 * behind this flag, so restoring it only requires setting AUTH_ENABLED=true.
 */
export const authEnabled = env.get('AUTH_ENABLED', false);
