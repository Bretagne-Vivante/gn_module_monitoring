=========
CHANGELOG
=========

0.2.1 (unreleased)
------------------

**🚀 Nouveautés**
  * pouvoir définir des champs *dynamiques*, dont les attributs peuvent dépendre des valeurs des autres composants (pour afficher un composant en fonction de la valeur d'autres composants)
    * exemples dans test
  * champs data JSONB dans module_complement

**🐛 Corrections**
  * correction vue synthese

0.2.0 (2020-10-23)
------------------

Nécessite la version 2.5.2 de GeoNature minimum.

**Nouveautés**

* Possibilité de renseigner le JDD à chaque visite (`#30 <https://github.com/PnX-SI/gn_module_monitoring/issues/30>`__)
* Possibilité pour les administrateurs d'associer les JDD à un sous-module directement depuis l'accueil du sous-module (`#30 <https://github.com/PnX-SI/gn_module_monitoring/issues/30>`__)
* Possibilité de créer des groupes de sites (encore un peu jeune) (`#24 <https://github.com/PnX-SI/gn_module_monitoring/issues/24>`__)
* Possibilité de créer une visite directement après la création d'un site, et d'une observation directement après la création d'une visite (`#28 <https://github.com/PnX-SI/gn_module_monitoring/issues/28>`__)
* Redirection sur sa page de détail après la création d'un objet, plutôt que sur la liste (`#22 <https://github.com/PnX-SI/gn_module_monitoring/issues/22>`__)
* Mise à jour du composant de gestion et d'affichage des médias
* Ajout d'un composant de liste modulable (``datalist``) pouvant interroger une API, pouvant être utilisé pour les listes de taxons, d'observateurs, de jdd, de nomenclatures, de sites, de groupes de sites, etc... (`#44 <https://github.com/PnX-SI/gn_module_monitoring/issues/44>`__)
* Liste des observations : ajout d'un paramètre permettant d'afficher le nom latin des taxons observés (`#36 <https://github.com/PnX-SI/gn_module_monitoring/issues/36>`__)
* Simplification de la procédure pour mettre les données dans la synthèse (un fichier à copier, un bouton à cocher et possibilité de customiser la vue pour un sous-module)
* Passage de la complexité des méthodes de mise en base des données et de gestion des relation par liste d'``id`` (observateurs, jdd du module, correlations site module) vers le module `Utils_Flask_SQLA` (amélioration de la méthode ``from_dict`` en mode récursif qui accepte des listes d'``id`` et les traduit en liste de modèles), (principalement dans ``backend/monitoring/serializer.py``)
* Suppression du fichier ``custom.json`` pour gérer son contenu dans les nouveaux champs de la table ``gn_monitoring.t_module_complements`` (`#43 <https://github.com/PnX-SI/gn_module_monitoring/issues/43>`__)
* Clarification et remplacement des ``module_path`` et ``module_code`` (`#40 <https://github.com/PnX-SI/gn_module_monitoring/issues/40>`__)

**Corrections**

* Amélioration des modèles SLQA pour optimiser la partie sérialisation (`#46 <https://github.com/PnX-SI/gn_module_monitoring/issues/46>`__)
* Renseignement de la table ``gn_synthese.t_sources`` à l'installation (`#33 <https://github.com/PnX-SI/gn_module_monitoring/issues/33>`__)
* Passage du commentaire de la visite en correspondance avec le champs ``comment_context`` de la Synthèse, dans la vue ``gn_monitoring.vs_visits`` (`#31 <https://github.com/PnX-SI/gn_module_monitoring/issues/31>`__)
* Remplissage de la table ``gn_commons.bib_tables_location`` pour les tables du schéma ``gn_monitoring`` si cela n'a pas été fait par GeoNature (`#27 <https://github.com/PnX-SI/gn_module_monitoring/issues/27>`__)
* Corrections et optimisations diverses du code et de l'ergonomie
* Corrections de la documentation et docstrings (par @jbdesbas)

**⚠️ Notes de version**

Si vous mettez à jour le module depuis la version 0.1.0 :

* Les fichiers ``custom.json`` ne sont plus utiles (la configuration spécifique à une installation (liste utilisateurs, etc..) 
est désormais gérée dans la base de données, dans la table ``gn_monitoring.t_module_complements``)
* Dans les fichiers ``config.json``, la variable ``data`` (pour précharger les données (nomenclatures, etc..)) est désormais calculée depuis la configuration. 
* Pour mettre à jour la base de données, il faut exécuter le fichier ``data/migration/migration_0.1.0_0.2.0.sql``
* Suivez la procédure classique de mise à jour du module (``docs/MAJ.rst``)

0.1.0 (2020-06-30)
------------------

Première version fonctionelle du module Monitoring de GeoNature. Nécessite la version 2.4.1 de GeoNature minimum.

**Fonctionnalités**

* Génération dynamique de sous-modules de gestion de protocoles de suivi
* Saisie et consultation de sites, visites et observations dans chaque sous-module
* Génération dynamique des champs spécifiques à chaque sous-module au niveau des sites, visites et observations (à partir de configurations json et basé sur le composant ``DynamicForm`` de GeoNature)
* Ajout de tables complémentaires pour étendre les tables ``t_base_sites`` et ``t_base_visits`` du schema ``gn_monitoring`` permettant de stocker dans un champs de type ``jsonb`` les contenus des champs dynamiques spécifiques à chaque sous-module
* Ajout de médias locaux ou distants (images, PDF, ...) sur les différents objets du module, stockés dans la table verticale ``gn_commons.t_medias``
* Mise en place de fonctions SQL et de vues permettant d'alimenter la Synthèse de GeoNature à partir des données des sous-modules des protocoles de suivi (#14)
* Ajout d'une commande d'installation d'un sous-module (``flask monitoring install <module_dir_config_path> <module_code>``)
* Ajout d'une commande de suppression d'un sous-module (``remove_monitoring_module_cmd(module_code)``)
* Documentation de l'installation et de la configuration d'un sous-module de protocole de suivi

* Des exemples de sous-modules sont présents [ici](https://github.com/PnCevennes/protocoles_suivi/)
