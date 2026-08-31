import { test } from '@japa/runner';
import { MobilityCatalogQuery } from '#mobility/queries/mobility_catalog_query';

test.group('MobilityCatalogQuery', () => {
	test('returns an attributed theoretical journey based on the TCL fixture', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute({
			origin: 'Pl. W. Churchill',
			destination: 'Gare des Bénédictins',
		});
		const recommended = catalog.journeys[0];

		assert.isTrue(catalog.meta.isDemo);
		assert.equal(catalog.meta.realtimeStatus, 'unavailable');
		assert.equal(recommended.legs.find((leg) => leg.mode === 'bus')?.line, '6');
		assert.isTrue(recommended.theoretical);
		assert.isAtLeast(catalog.selectedRouteGeometry.length, 2);
		assert.equal(catalog.sources[0].license, 'ODbL 1.0');
	});

	test('leaves the search empty until both ends of the trip are filled', ({ assert }) => {
		const empty = new MobilityCatalogQuery().execute();
		const partial = new MobilityCatalogQuery().execute({ origin: 'Pl. W. Churchill' });

		for (const catalog of [empty, partial]) {
			assert.isFalse(catalog.search.hasSearch);
			assert.isFalse(catalog.search.isSupported);
			assert.isEmpty(catalog.journeys);
			assert.isEmpty(catalog.selectedRouteGeometry);
		}

		assert.equal(empty.search.origin, '');
		assert.equal(empty.search.destination, '');
		assert.equal(partial.search.origin, 'Pl. W. Churchill');
	});

	test('exposes the complete TCL route catalog from the current dedicated feed', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute();

		assert.lengthOf(catalog.lines, 47);
		assert.includeMembers(
			catalog.lines.map((line) => line.shortName),
			['1', '5', '11', 'AERO', 'N1', 'D10'],
		);
		assert.equal(catalog.lines.find((line) => line.shortName === 'AERO')?.color, '#144390');
	});

	test('does not attach the Churchill fixture to an unsupported search', ({ assert }) => {
		const catalog = new MobilityCatalogQuery().execute({
			origin: '  Mairie de Limoges ',
			destination: ' Gare Montjovis ',
		});

		assert.equal(catalog.search.origin, 'Mairie de Limoges');
		assert.equal(catalog.search.destination, 'Gare Montjovis');
		assert.isTrue(catalog.search.hasSearch);
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
