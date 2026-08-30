import { inject } from '@adonisjs/core';
import MobilityCatalogTransformer from '#app/mobility/transformers/mobility_catalog_transformer';
import { MobilityCatalogQuery } from '#mobility/queries/mobility_catalog_query';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class JourneyPlannerController {
	constructor(private readonly catalog: MobilityCatalogQuery) {}

	async render({ inertia, request }: HttpContext) {
		const projection = this.catalog.execute({
			origin: request.input('from'),
			destination: request.input('to'),
		});

		return inertia.render('journeys/index', {
			catalog: MobilityCatalogTransformer.transform(projection),
		});
	}
}
