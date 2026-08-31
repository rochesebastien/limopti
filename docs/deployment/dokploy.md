# Déployer Limopti sur Dokploy

Cette procédure déploie l’application depuis GitHub avec le `Dockerfile` du
dépôt et utilise une base PostgreSQL gérée séparément par Dokploy.

## 1. Fusionner la branche de préparation

Dokploy doit suivre la branche `main`. Fusionnez d’abord la pull request qui
ajoute le socle Limopti et les fichiers de déploiement, puis vérifiez que la CI
GitHub est verte.

## 2. Créer la base de données

Dans le projet et l’environnement Dokploy qui hébergeront Limopti :

1. créez un service **PostgreSQL** nommé `limopti-db` ;
2. choisissez un utilisateur, un nom de base et un mot de passe robustes ;
3. déployez la base ;
4. copiez son **Internal Connection URL**.

N’exposez pas le port PostgreSQL sur Internet : l’URL interne est suffisante
pour une application située dans le même environnement Dokploy.

Le MVP actuel fonctionne avec PostgreSQL standard. Pour préparer les futurs
calculs géographiques PostGIS avant d’insérer des données, Dokploy permet de
définir une image personnalisée dans les paramètres avancés de la base, par
exemple `postgis/postgis:18-3.6-alpine`.

## 3. Créer l’application

1. créez une **Application** nommée `limopti` ;
2. sélectionnez le fournisseur GitHub et le dépôt
   `rochesebastien/limopti` ;
3. sélectionnez la branche `main` et le chemin de build `/` ;
4. choisissez le type de build **Dockerfile** ;
5. renseignez `Dockerfile` comme chemin du Dockerfile et `.` comme contexte ;
6. laissez le stage vide pour utiliser le dernier stage `runner` ;
7. activez l’auto-déploiement si chaque fusion dans `main` doit déclencher un
   nouveau déploiement.

## 4. Configurer les variables

Générez une clé Adonis localement, sans l’ajouter au dépôt :

```bash
yarn workspace @limopti/web exec node ace generate:key --show
```

Ajoutez ensuite ces variables dans l’onglet **Environment** de l’application :

```dotenv
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
LOG_LEVEL=info
TZ=Europe/Paris
APP_KEY=<clé générée à l’étape précédente>
APP_URL=https://limopti.votre-domaine.fr
DATABASE_URL=<Internal Connection URL de limopti-db>
SESSION_DRIVER=cookie
```

`APP_URL` doit correspondre exactement au domaine HTTPS final. Ne placez ni
`APP_KEY`, ni `DATABASE_URL`, ni le mot de passe PostgreSQL dans GitHub.

Les arguments de build suivants sont facultatifs, car le `Dockerfile` fournit
déjà ces valeurs publiques par défaut :

```dotenv
VITE_APP_NAME=Limopti
VITE_MAP_TILES_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

Dans Dokploy, renseignez-les dans **Build Time Arguments**, pas dans les secrets
d’exécution. Toute modification d’une variable `VITE_*` nécessite un rebuild.

## 5. Configurer le domaine

Dans l’onglet **Domains** :

1. ajoutez votre domaine ou générez un domaine `traefik.me` ;
2. indiquez le port cible `3333` ;
3. activez HTTPS et la création automatique du certificat ;
4. reportez l’URL finale dans `APP_URL`, puis redéployez si elle a changé.

Il n’est pas nécessaire de publier manuellement le port 3333 dans les réglages
avancés lorsque le domaine Traefik est configuré.

## 6. Déployer et vérifier

Lancez **Deploy**. Au démarrage, le conteneur exécute automatiquement les
migrations Kysely avec `node ace migrate`, puis démarre AdonisJS.

Vérifiez ensuite :

```text
https://limopti.votre-domaine.fr/healthz
```

La réponse attendue est :

```json
{ "status": "ok", "service": "limopti" }
```

Testez également l’accueil, `/lines`, `/favorites`, `/traffic`, `/sources`,
l’inscription et la connexion.

## 7. Santé, redémarrage et zéro interruption

Le `Dockerfile` contient déjà un `HEALTHCHECK`. Pour reproduire explicitement
la configuration dans **Advanced → Swarm Settings → Health Check** :

```json
{
	"Test": [
		"CMD",
		"node",
		"-e",
		"fetch('http://127.0.0.1:3333/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"
	],
	"Interval": 30000000000,
	"Timeout": 5000000000,
	"StartPeriod": 30000000000,
	"Retries": 3
}
```

Pour **Update Config** :

```json
{
	"Parallelism": 1,
	"Delay": 10000000000,
	"FailureAction": "rollback",
	"Order": "start-first"
}
```

Cette stratégie ne bascule vers le nouveau conteneur qu’après son démarrage et
permet à Dokploy de revenir à la version précédente en cas d’échec.

## 8. Sauvegardes

Configurez une destination S3 et une sauvegarde planifiée pour `limopti-db`.
Testez aussi une restauration avant de considérer la sauvegarde comme fiable.

## Diagnostic rapide

- **Bad Gateway** : vérifiez `HOST=0.0.0.0`, `PORT=3333` et le port cible du
  domaine.
- **Le conteneur redémarre** : contrôlez `APP_KEY`, `APP_URL`, `DATABASE_URL`
  et les logs de migration.
- **Connexion impossible** : vérifiez que la migration `create_users_table`
  est passée et que l’URL PostgreSQL est l’URL interne.
- **Carte vide** : le reste de l’application doit fonctionner ; vérifiez
  l’accès du navigateur à `tile.openstreetmap.org` et les erreurs réseau côté
  client. Le service public d’OpenStreetMap convient à une démonstration ;
  au-delà, renseignez `VITE_MAP_TILES_URL` avec votre propre serveur de tuiles.
