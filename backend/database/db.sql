--- #### Base de donnee de l'application
   -- Yeye application de gestion destiné a plusieurs utilisateurs

--- #### Contraintes

-- # Boutiques (1,n) ==> (1,1) : utilisateur
alter table boutiques add constraint boutiques_fkey1 foreign key (us_id) references utilisateurs (us_id);
-- confusion d'architecture (mono ou multi)
alter table boutiques add constraint boutiques_unique1 unique(bo_nom,us_id);
alter table boutiques add constraint boutiques_unique2 unique (bo_id,bo_email);
alter table boutiques add constraint boutiques_unique3 unique (bo_id,bo_tel);

-- # Utilisateurs
alter table utilisateurs add constraint utilisateurs_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table utilisateurs add constraint utilisateurs_unique1 unique (us_prenom,us_nom);
alter table utilisateurs add constraint utilisateurs_check1 check (us_role in ('admin','ger','prop'));
-- prevenir la creation de boutique multiple (les memes gerants)
alter table utilisateurs add constraint utilisateurs_unique2 unique (us_email);
alter table utilisateurs add constraint utilisateurs_unique3 unique (us_tel);

-- # Droits
alter table droits add constraint droits_unique1 unique (dr_nom,dr_action,dr_etat,us_id); -- Exemple : Ajouter deux fois dans la meme fonctionnalité
alter table droits add constraint droits_fkey1 foreign key (us_id) references utilisateurs (us_id) on update cascade on delete cascade;

-- # Groupes
alter table groupes add constraint groupes_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table groupes add constraint groupes_unique unique (bo_id,gr_nom);
alter table groupes add constraint groupes_check1 check (gr_type in ('services')); -- Example : grouper les services au choix de l'utilisateurd

-- #Paiements
alter table paiements add constraint paiements_fkey1 foreign key (us_id) references utilisateurs (us_id);
alter table paiements add constraint paiements_fkey2 foreign key (bo_id) references boutiques (bo_id);
alter table paiements add constraint paiements_unique unique(bo_id,us_id,annee,mois);
alter table paiements add constraint paiements_check1 check (pa_mte >=0);
alter table paiements add constraint paiements_check2 check (mois <= extract (month from now()::date));
alter table paiements add constraint paiements_check3 check (annee <= extract (year from now()::date));

-- # Fournisseurs
alter table fournisseurs add constraint fournisseurs_fkey1 foreign key (bo_id) references boutiques (bo_id);
-- les informations unique du fournisseur de la boutique
alter table fournisseurs add constraint fournisseurs_unique1 unique (bo_id,fo_nom); -- une autre boutique peut aussi avoir le meme fournisseur ou meme deuxieme boutique
alter table fournisseurs add constraint fournisseurs_unique2 unique (bo_id,fo_tel);
alter table fournisseurs add constraint fournisseurs_unique3 unique (bo_id,fo_email);

-- # Depots 
alter table depots add constraint depots_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table depots add constraint depots_unique1 unique (de_nom,bo_id);

-- # Produits
alter table produits add constraint produits_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table produits add constraint produits_fkey2 foreign key (de_id) references depots (de_id);
alter table produits add constraint produits_fkey3 foreign key (fo_id) references fournisseurs (fo_id);
alter table produits add constraint produits_unique1 unique (bo_id,de_id,pr_nom);
alter table produits add constraint produits_check1 check (pr_qte >=0);
alter table produits add constraint produits_check2 check (pr_prix >=100); -- prix minimun dans l'application 100 FCFA
alter table produits add constraint produits_check3 check (pr_sold >=0);

-- # Modalites
alter table modalites add constraint modalites_unique1 unique (mo_nom);

-- # Services
alter table services add constraint services_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table services add constraint services_fkey2 foreign key (gr_id) references groupes (gr_id);
alter table services add constraint services_chek1 check (debut < fin); -- deux dates differents avec importante
alter table services add constraint serices_unique1 unique (bo_id,gr_id,cl_nom); 

-- # Vendres
alter table vendres add constraint vendres_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table vendres add constraint vendres_fkey2 foreign key (us_id) references utilisateurs (us_id);
alter table vendres add constraint vendres_fkey3 foreign key (cl_id) references clients (cl_id);

-- Ventes
alter table ventes add constraint ventes_fkey1 foreign key (bo_id) references boutiques (bo_id); -- Ex : le nombres de ventes de la boutique
alter table ventes add constraint ventes_fkey2 foreign key (pr_id) references produits (pr_id);
alter table ventes add constraint ventes_fkey3 foreign key (mo_id) references modalites (mo_id);  -- Ex : produits vendu par dette, ...
alter table ventes add constraint ventes_fkey4 foreign key (vend_id) references vendres (vend_id) on update cascade on delete cascade;  -- Dans le pannier de ventes n1
alter table ventes add constraint ventes_unique1 unique (pr_id,vend_id);
alter table ventes add constraint ventes_check1 check (ven_qte >=0);
alter table ventes add constraint ventes_check2 check (ven_prix >=100); -- prix minimun dans l'application 100 FCFA
alter table ventes add constraint ventes_check3 check (ven_pay >=0);

-- # Commanders
alter table commanders add constraint commanders_fkey1 foreign  key (bo_id) references boutiques (bo_id);
alter table commanders add constraint commanders_fkey2 foreign  key (de_id) references depots (de_id); -- Ex : depots d'ordinateurs
alter table commanders add constraint commanders_unique1 unique (bo_id,de_id,fo_id); -- Achats (commande fournisseur)
alter table commanders add constraint commanders_unique2 unique (bo_id,cl_nom); -- Ventes (commande client)
alter table commanders add constraint commanders_check1 check (etat in ('commander','livrer','recue')); -- 2 etapes pour l'achat et 3 etapes pour la vente (client)
-- # Commandes
alter table commandes add constraint commandes_fkey1 foreign key (cmd_id) references commanders (cmd_id); -- Ex : commande de 10 ihpone (pannier de commande)
alter table commandes add constraint commandes_fkey2 foreign key (pr_id) references produits (pr_id);
alter table commandes add constraint commandes_fkey3 foreign key (mo_id) references modalites (mo_id);
alter table commandes add constraint commandes_check1 check (cm_qte >=0);
alter table commandes add constraint commandes_check2 check (cm_prix >=100); -- prix minimun dans l'application 100 FCFA

-- # Depenses
alter table depenses add constraint depenses_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table depenses add constraint depenses_fkey2 foreign key (gr_id) references groupes (gr_id);
alter table depenses add constraint depenses_check1 check (dep_mte >=100);

-- # Factures
alter table factures add constraint factures_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table factures add constraint factures_unique unique (bo_id,fa_titre);

-- # Achats
alter table achats add constraint achats_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table achats add constraint achats_fkey2 foreign key (fo_id) references fournisseurs (fo_id);
alter table achats add constraint achats_unique1 unique (bo_id,fo_id,ac_date);
alter table achats alter column ac_etat set default '0';

-- # Fcommande
alter table fcommandes add constraint fcommandes_fkey1 foreign key (pr_id) references produits (pr_id);
alter table fcommandes add constraint fcommandes_fkey2 foreign key (ac_id) references achats (ac_id) on update cascade on delete cascade;

-- # Client
-- Note : deux boutiques peut avoir le meme coordonnés pour le meme sans se rendre compte
alter table clients add constraint clients_fkey1 foreign key (bo_id) references boutiques (bo_id);
alter table clients add constraint clients_unique1 unique (cl_nom,bo_id);
alter table clients add constraint clients_unique2 unique (cl_tel,bo_id);