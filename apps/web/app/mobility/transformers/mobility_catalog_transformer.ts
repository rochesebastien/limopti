import { BaseTransformer } from '@adonisjs/core/transformers';
import type { MobilityCatalogProjection } from '#mobility/queries/mobility_catalog_query';

export default class MobilityCatalogTransformer extends BaseTransformer<MobilityCatalogProjection> {
	toObject() {
		return this.resource;
	}
}
