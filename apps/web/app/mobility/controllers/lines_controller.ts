import { inject } from '@adonisjs/core';
import MobilityCatalogTransformer from '#app/mobility/transformers/mobility_catalog_transformer';
import { MobilityCatalogQuery } from '#mobility/queries/mobility_catalog_query';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class LinesController {
	constructor(private readonly catalog: MobilityCatalogQuery) {}

	async render({ inertia }: HttpContext) {
		return inertia.render('lines/index', {
			catalog: MobilityCatalogTransformer.transform(this.catalog.execute()),
		});
	}
}
