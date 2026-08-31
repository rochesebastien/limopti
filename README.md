# Limopti

Limopti modernise l’information voyageur à Limoges : itinéraires bus et marche,
favoris réellement utiles, perturbations lisibles et circulation routière
cartographiée sans masquer la fraîcheur des données.

> [!NOTE]
> Le dépôt contient actuellement un MVP de démonstration. Les horaires affichés
> sont un extrait théorique du GTFS TCL et ne constituent pas du temps réel.

## Fonctionnalités du MVP

- formulaire de recherche avec un scénario reproductible Churchill → Gare ;
- comparaison de trois options bus et marche sur ce scénario ;
- carte MapLibre avec un tracé réel de la ligne 6 entre Churchill et la gare ;
- annuaire des principales lignes TCL ;
- favoris enregistrés localement sous forme d’intention de trajet ;
- vue dédiée aux perturbations et au trafic ;
- page Sources détaillant licences, validité et limites de chaque donnée ;
- authentification Adonis prête pour la synchronisation future des favoris,
  actuellement désactivée : l’application est en accès libre.

## Stack

- AdonisJS 7 comme serveur et Backend for Frontend ;
- Inertia 3 et React 19 pour les pages ;
- MapLibre GL JS pour la carte ;
- PostgreSQL, Kysely et une architecture modulaire ;
- Tailwind CSS 4, Ark UI et Storybook pour le design system ;
- Yarn 4, TypeScript, Oxlint, Oxfmt et Japa.

La structure est dérivée de
[RomainLanz/adonis-llm-boilerplate](https://github.com/RomainLanz/adonis-llm-boilerplate)
et conserve ses frontières entre livraison Adonis, cœur applicatif et interface
Inertia.

## Démarrage local

Prérequis : Node.js 24+, Corepack et Docker.

```bash
corepack enable
yarn install
cp apps/web/.env.example apps/web/.env
yarn workspace @limopti/web exec node ace generate:key
yarn docker:up
yarn workspace @limopti/web db:migrate
yarn dev
```

L’application est servie sur <http://localhost:3333> et Storybook sur
<http://localhost:6006> avec `yarn storybook`.

Le planificateur public fonctionne en mode démonstration sans base.
Les recherches hors du scénario Churchill → Gare affichent volontairement un
état non pris en charge : le moteur de calcul GTFS/OTP reste à brancher.

### Accès libre

`AUTH_ENABLED=false` (valeur par défaut) place l’application en accès libre :
toutes les pages sont consultables sans compte, les écrans de connexion,
d’inscription et de compte redirigent vers l’accueil, et aucune requête base de
données n’est émise. Le code d’identité reste intact ; repasser la variable à
`true` (avec PostgreSQL disponible) restaure la connexion.

## Déploiement

Le dépôt contient une image Docker de production pour Dokploy. La procédure
complète — application GitHub, PostgreSQL, variables, domaine, santé et
déploiements sans interruption — se trouve dans
[`docs/deployment/dokploy.md`](docs/deployment/dokploy.md).

## Vérification

```bash
yarn lint
yarn format
yarn typecheck
yarn test
yarn build
```

## Données

La source transport principale est le
[GTFS TCL dédié](https://transport.data.gouv.fr/resources/82348), publié par
Nouvelle-Aquitaine Mobilités. L’extrait de démonstration est attribué à STCLM /
Limoges Métropole et reste soumis à l’ODbL.

Le fond de carte provient d’OpenStreetMap via OpenFreeMap. Les données de trafic
Bison Futé et les perturbations présentes dans l’interface sont actuellement
des exemples explicitement signalés comme tels.

Consultez `/sources` dans l’application pour le détail des sources, licences,
dates de validité et limitations.

## Architecture

```text
apps/web/app       Adaptateurs HTTP, contrôleurs et transformers
apps/web/src       Capacités métier, Actions, Queries et dépôts
apps/web/inertia   Pages et composants React
packages/design-system
                   Primitives visuelles réutilisables
```

Les règles détaillées se trouvent dans `AGENTS.md` et `docs/architecture`.

## Licence

Le code est distribué sous licence MIT. Le socle d’origine conserve la mention
de copyright de Romain Lanz. Les bases de données tierces gardent leurs propres
licences, notamment ODbL pour le GTFS TCL et OpenStreetMap.
