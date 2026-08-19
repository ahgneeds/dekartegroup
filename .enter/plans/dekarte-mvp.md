# Dekarte — MVP : Landing + Simulateur + Back Office Super Admin

## Contexte

Projet « Dekarte — Univers Immobilier & Déco » : service marocain de design d'intérieur (visualisation 3D/photoréaliste). Ce MVP livre uniquement :
1. Une landing page publique orientée conversion.
2. Le formulaire / simulateur de demande de design d'intérieur (FR + AR, RTL).
3. Le back office Super Admin pour gérer ces demandes.
4. Un dépôt GitHub propre prêt à être connecté.

Hors périmètre (à ne PAS construire) : toute autre fonctionnalité immobilière/déco (vente, location, paiement en ligne, comptes clients, etc.). Paiement 100 % manuel pour ce MVP.

Dépendances à activer au début de l'implémentation (dialogues système) : **Enter Cloud** (`supabase_enable`) puis **Enter i18n** (`i18n_enable`). Sans Enter Cloud, pas de base de données pour les demandes/photos ; sans i18n, pas de FR/AR géré.

## Données à fournir par l'utilisateur (pendant l'implémentation)

- **Images** (importées par l'utilisateur, placées dans `public/images/`) : logo Dekarte, image héro, 3 visuels de style (Marocain, Moderne, Mixte). Si manquantes au moment de l'implémentation, s'arrêter et demander.
- **Email admin** (compte Super Admin) : demandé au démarrage de l'implémentation ; mot de passe généré et communiqué une seule fois (modifiable ensuite dans le back office via le flux « mot de passe oublié »).

## Architecture Backend (Enter Cloud)

Outils : `supabase_migration`, `supabase_get_table_schema`, `supabase_configure_auth`, `supabase_add_secret`, `supabase_read_query`. Références : `/workspace/.agents/skills/enter_cloud@1/references/{database,auth,edge-functions}.md`.

### Tables (migrations avec RLS activé dans la même migration)

**`requests`** — chaque demande de design.
| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid pk | `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` |
| `client_name` | text | requis |
| `whatsapp` | text | numéro normalisé `+212XXXXXXXXX` |
| `email` | text | optionnel |
| `property_type` | text | appartement, villa, studio, maison, local commercial, bureau, autre |
| `design_scope` | text | `une_piece`, `plusieurs_pieces`, `toute_propriete` |
| `rooms` | jsonb | `[{type, longueur, largeur, hauteur, surface}]` (vide si toute la propriété) |
| `total_surface_m2` | numeric | somme des pièces ou surface totale saisie |
| `style` | text | `marocain`, `moderne`, `mixte` |
| `budget_dh` | numeric | optionnel, min 2000 |
| `price_per_m2` | numeric | **instantané au moment de la soumission** |
| `total_price_dh` | numeric | `surface × price_per_m2` |
| `photo_urls` | jsonb | chemins Storage des photos uploadées |
| `payment_method` | text | optionnel : virement, cash_plus, wafacash |
| `payment_status` | text | `non_paye` (défaut) / `paye` |
| `status` | text | `demande_recue` (défaut), `paiement_en_attente`, `paiement_recu`, `en_cours`, `design_livre`, `termine` |
| `admin_notes` | text | notes internes |

Politiques RLS : `INSERT` public (anon) — les clients soumettent sans compte ; `SELECT`/`UPDATE` réservés à l'utilisateur authentifié (admin).

**`settings`** — singleton (`id` = 1, contrainte `CHECK (id = 1)`), colonne `price_per_m2` numeric défaut **20**, `updated_at`. Seed d'une ligne (20 DH). RLS : `SELECT` public (la calculatrice publique lit le prix), `UPDATE` authentifié (admin). Le prix n'est JAMAIS modifié rétroactivement sur les demandes déjà soumises (instantané `price_per_m2` sur `requests`).

### Storage
Bucket `request-photos` : politiques sur `storage.objects` — `INSERT` anon (upload depuis le simulateur), `SELECT` authentifié (photos visibles uniquement dans le back office).

### Authentification admin
- `supabase_configure_auth` : auto-confirm des emails activé, inscription publique désactivée (un seul compte).
- Backend function `create-admin` : lit `ADMIN_EMAIL`/`ADMIN_PASSWORD` depuis les secrets Enter Cloud (`supabase_add_secret`), crée le user auth s'il n'existe pas. Appelée une fois à l'installation. `ADMIN_PASSWORD` généré aléatoirement, communiqué à l'utilisateur une fois.
- Login côté client : `supabase.auth.signInWithPassword`, session stockée (`onAuthStateChange` + `session`), redirection si non connecté. La sécurité est garantie côté serveur par la RLS (jamais de contrôle de droits côté client).

## i18n (FR / AR)

- `i18n.config.json` : `fallbackLng: "fr"`, langues `fr` (detect `["fr"]`, `ltr`) et `ar` (detect `["ar"]`, `rtl`). Supprimer `en.json` / `zh-CN.json` (parité de clés exigée).
- `public/locales/fr.json` = source de vérité (clés plates à point), `public/locales/ar.json` miroir traduit. Tous les textes publics passent par `t()`. Chiffres en chiffres latins.
- Détection automatique déjà en place (`cookie` > `navigator` > `htmlTag`) : appareil AR → arabe, FR → français, autre → français. Choix manuel mémorisé via cookie (comportement existant de `src/i18n/config.ts`).
- Switcher visible **FR | العربية** (boutons au lieu du select), monté dans le header + pied de simulateur.
- RTL : utilitaires logiques (`ms-`/`me-`, `text-start`/`text-end`), `dir` géré automatiquement par le template.
- Back office : français statique (pas de `t()`), hors i18n.
- Contrats vérifiés via `check-i18n.mjs` + `scan-i18n.mjs` en fin d'implémentation.

## Frontend

### Routes (`src/router.tsx`)
| Route | Page |
|---|---|
| `/` | Landing publique |
| `/simulateur` | Simulateur multi-étapes |
| `/confirmation` | Résumé + instructions de paiement (lecture `sessionStorage`, insensible au refresh) |
| `/admin` | Login admin (redirige vers dashboard si connecté) |
| `/admin/dashboard` | Liste + filtres + réglage prix/m² |
| `/admin/requests/:id` | Détail complet d'une demande |

### Landing (`src/pages/Index.tsx` réécrit + `src/components/landing/`)
Header (logo + switcher FR|AR + CTA) → Héro (headline claire + image de référence + CTA **« Créer mon projet »**) → bandeau « comment ça marche » (bref) → aperçu des 3 styles (images fournies) → livrable (ce que le client reçoit après paiement) → footer (WhatsApp). Design premium, chaleureux, sobre, mobile-first.

### Simulateur (`src/components/simulator/`) — état local, étapes :
1. **Contact** : nom complet, WhatsApp (validation Maroc, zod : `06/07XXXXXXXX` ou `+2126/+2127XXXXXXXX` → normalisé `+212XXXXXXXXX`), email optionnel.
2. **Type de bien** : Appartement, Villa, Studio, Maison, Local commercial, Bureau, Autre.
3. **Périmètre** : Une pièce / Plusieurs pièces / Toute la propriété.
   - Une/plusieurs pièces : liste dynamique de pièces (type : Salon, Chambre, Cuisine, Salle de bain, Bureau, Balcon, Terrasse, Entrée, Salle à manger, Mra7, Autre + Longueur × Largeur × Hauteur). Surface pièce auto = `longueur × largeur` ; total = somme. Aucune pièce obligatoire.
   - Toute la propriété : un seul champ « surface totale m² ».
4. **Style** : 3 cartes visuelles (Marocain / Moderne / Mixte) avec les images fournies.
5. **Budget** (optionnel) : champ numérique, min **2 000 DH**, texte explicite : « ce budget n'est PAS le prix du service Dekarte, il sert à adapter la proposition au budget réalisable du client ».
6. **Photos** : upload multiples (Storage), message « Pour un meilleur résultat, prenez la photo depuis l'entrée de la pièce, idéalement depuis l'emplacement de la porte. ».
7. **Calcul du prix** (toujours visible) : `{surface} m² × {price} DH = {total} DH`, prix/m² lu depuis `settings` (fallback 20).
8. **Récapitulatif** : Client, WhatsApp, Bien, Pièces, Surface, Style, Budget, Prix/m², Prix total → **« Envoyer ma demande »** → upload photos + INSERT immédiat dans `requests` (avec `price_per_m2` instantané). Même sans paiement, la demande arrive dans le back office. Échec → toast d'erreur, données conservées.

### Confirmation (`src/pages/Confirmation.tsx`)
Récapitulatif complet + prix total réaffiché. Paiement **manuel** :
- **Adam Houat — SAHAM BANK — RIB : 022780000053002874403274** (bouton copier)
- Moyens : Virement bancaire, Cash Plus, Wafacash
- Envoi de la preuve par WhatsApp (**0661221643**) ou email
- Livrable Dekarte après paiement : visualisation réaliste, design adapté au style, design adapté au budget, recommandations mobilier/déco marché marocain, liste fournisseurs si possible, suivi WhatsApp.

### Back Office (`src/pages/admin/` + sidebar shadcn)
- **Login** : email/mot de passe.
- **Dashboard** : compteurs (total / non payées / payées), filtres par `payment_status`, liste des demandes (date, client, WhatsApp, bien, surface, style, total, statuts), réglage global **prix/m²** (écrit dans `settings`, lu ensuite par la calculatrice publique).
- **Détail** : toutes les infos client/bien/pièces/dimensions/m²/style/budget/prix-m² utilisé/total, photos (Storage), changement de `status` (6 états) et de `payment_status`, notes internes (`admin_notes`), bouton WhatsApp (lien `wa.me`).

### Design system
- `src/index.css` + `tailwind.config.ts` : palette chaleureuse « déco marocaine premium » (ivoire/écru, charbon profond, terracotta/ambre), typographies Google Fonts (sérif élégante pour titres + sans pour le texte), ombres et radius raffinés, tokenisés en CSS vars. Variants shadcn (buttons, cards, inputs, selects, badges) pour les états.
- Icônes lucide-react uniquement (pas d'émojis).

## Fichiers principaux

- Modifiés : `src/router.tsx`, `src/pages/Index.tsx`, `i18n.config.json`, `src/index.css`, `tailwind.config.ts`, `index.html` (fonts), `src/components/language-switcher.tsx`, `src/i18n/util.ts` (si contrôle i18n le demande), `.env.example` (non-secrets uniquement).
- Créés : `public/locales/fr.json`, `public/locales/ar.json` (suppr. `en.json`, `zh-CN.json`) ; `src/lib/{constants,validation,format}.ts` ; `src/components/landing/*` ; `src/components/simulator/*` ; `src/pages/{Simulator,Confirmation}.tsx` ; `src/pages/admin/*` ; intégration supabase générée par le framework.
- Réutilisés : composants shadcn existants (button, card, input, select, textarea, badge, dialog, sonner…), `src/i18n/*` (template), `src/lib/utils.ts`.

## GitHub

Je ne peux pas pousser vers le compte GitHub de l'utilisateur sans identifiants. Préparation côté dépôt :
- Vérifier `.gitignore` (exclut `.env*`, `node_modules`, builds, `reports/`).
- `.env.example` conservé avec uniquement des clés non secrètes.
- Aucune clé API / secret dans le code ni dans l'historique.
- À la fin : instructions exactes données à l'utilisateur (créer le repo sur GitHub, `git remote add origin https://github.com/<user>/dekarte.git`, `git push -u origin main`).

## Implementation checklist

- [ ] Activer Enter Cloud (`supabase_enable`) puis Enter i18n (`i18n_enable`).
- [ ] Charger le skill `enter_cloud` (déjà fait) ; créer les migrations `requests` + `settings` (RLS activé dans la migration, politiques INSERT anon / SELECT-UPDATE authentifié) ; vérifier RLS via `supabase_get_table_schema`.
- [ ] Seed `settings` (price_per_m2 = 20, id = 1) ; politique SELECT public.
- [ ] Bucket Storage `request-photos` + politiques anon INSERT / authentifié SELECT.
- [ ] `supabase_configure_auth` (auto-confirm, inscription publique désactivée) ; secrets `ADMIN_EMAIL`/`ADMIN_PASSWORD` ; backend function `create-admin` appelée une fois.
- [ ] `i18n.config.json` → fr (ltr) + ar (rtl), fallback fr ; créer `fr.json` (source de vérité) + `ar.json` (miroir) ; supprimer `en.json`, `zh-CN.json`.
- [ ] Switcher « FR | العربية » en boutons ; monté dans header landing et simulateur ; textes publics 100 % `t()`.
- [ ] Landing page complète avec CTA « Créer mon projet » + images fournies (logo, héro, styles).
- [ ] Simulateur : étapes contact → bien → périmètre/pièces (calculs m² auto) → style → budget (min 2 000 DH + note) → photos → calcul prix (`surface × prix/m²` de `settings`, instantané à la soumission) → récapitulatif → « Envoyer ma demande » (INSERT immédiat + upload photos).
- [ ] Validation WhatsApp marocaine (zod) avec normalisation `+212`.
- [ ] Page `/confirmation` : récapitulatif + paiement manuel (Adam Houat / SAHAM BANK / RIB / Virement / Cash Plus / Wafacash / WhatsApp 0661221643) + livrable.
- [ ] Back office : login email/mot de passe, dashboard (filtres non payées/payées), réglage prix/m², détail demande (photos, notes, statuts), accès protégé par session + RLS.
- [ ] RTL/AR : contrôle visuel du sens et des chiffres ; back office resté français.
- [ ] Design system tokenisé (index.css + tailwind.config.ts + fonts) appliqué sur toutes les pages.

## Verification checklist

- [ ] `node /workspace/.agents/skills/enter_i18n/assets/scripts/check-i18n.mjs` → « i18n check passed » (parité des clés fr/ar).
- [ ] `node /workspace/.agents/skills/enter_i18n/assets/scripts/scan-i18n.mjs` exécuté en dernier (écrit `reports/i18n/summary.json`).
- [ ] `supabase_get_table_schema` sur `requests`/`settings` : RLS activé + politiques attendues présentes.
- [ ] Flux public : soumission complète → demande visible dans `/admin/dashboard` immédiatement (même sans paiement).
- [ ] Prix : 35 m² × 20 DH = 700 DH affiché ; changement du prix/m² dans le back office → nouvelle demande recalculée ; ancienne demande conserve son `price_per_m2` d'origine.
- [ ] Validation WhatsApp : rejette `06123`, accepte `0612345678`, `+212612345678` → stocké `+212612345678`.
- [ ] Budget : refusé sous 2 000 DH, optionnel sinon.
- [ ] AR : appareil AR → défaut arabe + RTL ; FR → français ; autre → français ; choix manuel mémorisé après refresh ; chiffres latins.
- [ ] Admin : accès `/admin/dashboard` refusé sans session ; changement de statuts + notes sauvegardés ; photos visibles.
- [ ] Build : `pnpm run build` sans erreur (lint + tsc exécutés par le framework en fin de tour).
- [ ] `.gitignore` exclut `.env*` ; aucun secret dans les fichiers versionnés ; instructions GitHub fournies à l'utilisateur.
