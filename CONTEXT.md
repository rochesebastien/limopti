# Domaine Limopti

Ce glossaire fixe les termes utilisés dans le produit et le code.

## Mobilité

**Lieu** : origine ou destination enregistrée par son libellé, ses coordonnées
et éventuellement un identifiant d’arrêt stable.

**Ligne** : service commercial TCL présenté à l’utilisateur, par exemple la
ligne 6. Une ligne regroupe plusieurs courses et directions.

**Course** : passage planifié d’un véhicule. Son `trip_id` GTFS peut changer à
chaque publication et ne doit pas identifier un favori.

**Trajet** : proposition complète entre deux lieux, composée d’étapes de marche
et de transport collectif.

**Favori** : intention de déplacement persistée avec une origine, une
destination, des modes et éventuellement une ligne ou une plage horaire.

**Perturbation** : événement affectant une ligne, une course, un arrêt ou un
tronçon routier. Sa source, sa période et son niveau de confiance sont toujours
conservés.

**Horaire théorique** : horaire provenant du GTFS statique, sans observation du
véhicule.

**Temps réel** : information horodatée issue d’un flux opérateur tel que
GTFS-RT ou SIRI. Limopti ne doit jamais présenter une estimation comme du temps
réel.

## Identité

**Utilisateur** : personne pouvant s’authentifier et, à terme, synchroniser ses
favoris entre plusieurs appareils.
