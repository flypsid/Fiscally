# Development Rules

## Command Suggestions

### Prohibited Commands

- **npm run dev**: Ne jamais suggérer automatiquement cette commande
  - Suggérer uniquement si explicitement demandé par l'utilisateur
  - Cela évite les démarrages non désirés du serveur de développement
- **npm start**: Ne pas suggérer automatiquement
- **yarn dev**: Ne pas suggérer automatiquement
- **pnpm dev**: Ne pas suggérer automatiquement

### Allowed Commands

Les commandes suivantes peuvent être suggérées automatiquement quand pertinentes :

- `npx tsc --noEmit` (Vérification des types TypeScript)
- `npm run build` (Build de production)
- `npm run lint` (Linting du code)
- `npm test` (Exécution des tests)
- `npm audit` (Audit de sécurité)
- `npm install` (Installation des dépendances)
- `npm ci` (Installation propre des dépendances)

## Justification

- L'utilisateur préfère contrôler quand le serveur de développement est lancé
- Évite les processus en arrière-plan non désirés
- Améliore l'expérience utilisateur en évitant les propositions répétitives

## Application

Cette règle s'applique à tous les assistants IA travaillant sur ce projet.
