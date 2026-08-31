import router from '@adonisjs/core/services/router';

const JourneyPlannerController = () => import('#app/mobility/controllers/journey_planner_controller');
const LinesController = () => import('#app/mobility/controllers/lines_controller');
const FavoritesController = () => import('#app/mobility/controllers/favorites_controller');
const TrafficController = () => import('#app/mobility/controllers/traffic_controller');
const SourcesController = () => import('#app/mobility/controllers/sources_controller');

router.get('/', [JourneyPlannerController, 'render']).as('home');
router.get('/lines', [LinesController, 'render']).as('lines.index');
router.get('/favorites', [FavoritesController, 'render']).as('favorites.index');
router.get('/traffic', [TrafficController, 'render']).as('traffic.index');
router.get('/sources', [SourcesController, 'render']).as('sources.index');
