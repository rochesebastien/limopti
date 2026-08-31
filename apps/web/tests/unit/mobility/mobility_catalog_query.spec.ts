import { test } from '@japa/runner';
import { MobilityCatalogQuery } from '#mobility/queries/mobility_catalog_query';

test.group('MobilityCatalogQuery', () => {
	test('returns an attributed theoretical journey based on the TCL fixture', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute();
		const recommended = catalog.journeys[0];

		assert.isTrue(catalog.meta.isDemo);
		assert.equal(catalog.meta.realtimeStatus, 'unavailable');
		assert.equal(recommended.legs.find((leg) => leg.mode === 'bus')?.line, '6');
		assert.isTrue(recommended.theoretical);
		assert.isAtLeast(catalog.selectedRouteGeometry.length, 2);
		assert.equal(catalog.sources[0].license, 'ODbL 1.0');
	});

	test('does not attach the Churchill fixture to an unsupported search', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute({
			origin: '  Mairie de Limoges ',
			destination: ' Gare Montjovis ',
		});

		assert.equal(catalog.search.origin, 'Mairie de Limoges');
		assert.equal(catalog.search.destination, 'Gare Montjovis');
		assert.isFalse(catalog.search.isSupported);
		assert.isEmpty(catalog.journeys);
		assert.isEmpty(catalog.selectedRouteGeometry);
	});

	test('never presents demo traffic and disruptions as live data', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute();

		assert.isTrue(catalog.traffic.every((event) => event.isDemo));
		assert.isTrue(catalog.disruptions.every((event) => event.isDemo));
	});
});
