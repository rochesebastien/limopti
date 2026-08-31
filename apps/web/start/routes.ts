import '#app/identity/routes';
import '#app/mobility/routes';
import router from '@adonisjs/core/services/router';

router.get('/healthz', ({ response }) => response.ok({ status: 'ok', service: 'limopti' })).as('health');
