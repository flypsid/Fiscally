# Stratégie de Sécurité - Better Auth

## Vue d'ensemble

Notre application implémente une stratégie de sécurité multicouche pour l'authentification, suivant les meilleures pratiques recommandées par Better Auth et les avertissements de sécurité de leur documentation.

## Couches de Protection

### 1. Middleware Next.js (Première couche)

**Fichier**: `src/middleware.ts`

```typescript
// Validation complète de session dans le middleware
const session = await auth.api.getSession({
  headers: request.headers,
});
```

**Avantages**:
- Protection au niveau de la requête
- Redirection immédiate pour les routes protégées
- Performance optimisée (pas de rendu inutile)

**Limitations**:
- Selon Better Auth, ne pas se fier uniquement au middleware
- Les cookies peuvent être manipulés côté client

### 2. Protection Côté Serveur (Deuxième couche)

**Fichier**: `src/components/auth/ServerProtectedRoute.tsx`

```typescript
// Validation de session côté serveur dans les Server Components
const session = await auth.api.getSession({
  headers: headers(),
});
```

**Avantages**:
- Validation sécurisée côté serveur
- Impossible à contourner depuis le client
- Conforme aux recommandations Better Auth

**Utilisation**:
```typescript
<ServerProtectedRoute locale={params.locale}>
  {/* Contenu protégé */}
</ServerProtectedRoute>
```

### 3. Protection Côté Client (Troisième couche)

**Fichier**: `src/components/auth/ProtectedRoute.tsx`

```typescript
// Protection réactive côté client
const { isAuthenticated, isLoading } = useAuth();
```

**Avantages**:
- Expérience utilisateur fluide
- Gestion des états de chargement
- Redirection automatique

**Utilisation**:
```typescript
<ProtectedRoute>
  {/* Interface utilisateur */}
</ProtectedRoute>
```

## Avertissements de Sécurité Adressés

### ⚠️ Avertissement 1: Configuration des Cookies

> "The getSessionCookie() function does not automatically reference the auth config specified in auth.ts"

**Solution**: Nous utilisons `auth.api.getSession()` au lieu de `getSessionCookie()` pour éviter les problèmes de configuration.

### ⚠️ Avertissement 2: Validation des Sessions

> "The getSessionCookie function only checks for the existence of a session cookie; it does not validate it"

**Solution**: 
- Middleware: `auth.api.getSession()` avec validation complète
- Server Components: `auth.api.getSession()` avec validation côté serveur
- Jamais de simple vérification d'existence de cookie

## Architecture de Sécurité

```
Requête → Middleware → Server Component → Client Component
    ↓         ↓              ↓               ↓
  Validation  Validation   Validation    UX/Loading
  complète    serveur      serveur       States
```

## Meilleures Pratiques Implémentées

### ✅ Validation Multicouche
- Middleware pour les redirections rapides
- Server Components pour la sécurité
- Client Components pour l'UX

### ✅ Pas de Contournement Possible
- Impossible de manipuler les cookies pour bypasser
- Validation serveur obligatoire
- Redirection automatique si session invalide

### ✅ Performance Optimisée
- Middleware évite le rendu inutile
- Server Components évitent les requêtes client
- Client Components gèrent l'UX

### ✅ Expérience Utilisateur
- États de chargement appropriés
- Redirections fluides
- Messages d'erreur localisés

## Utilisation Recommandée

### Pour les Pages Protégées

```typescript
export default async function ProtectedPage({ params }: { params: { locale: string } }) {
  return (
    <ServerProtectedRoute locale={params.locale}>
      <ProtectedRoute>
        {/* Votre contenu ici */}
      </ProtectedRoute>
    </ServerProtectedRoute>
  );
}
```

### Pour les API Routes

```typescript
export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Logique protégée
}
```

### Pour les Server Actions

```typescript
export async function protectedAction() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // Action protégée
}
```

## Configuration Better Auth

**Fichier**: `src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()], // Important pour Next.js
});
```

## Variables d'Environnement Requises

```env
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=${NEXT_PUBLIC_URL}
DATABASE_URL=your-database-url
```

## Tests de Sécurité

### Scénarios à Tester

1. **Accès sans session**: Redirection vers login
2. **Session expirée**: Redirection automatique
3. **Cookie manipulé**: Validation côté serveur échoue
4. **Navigation directe**: Middleware bloque l'accès

### Commandes de Test

```bash
# Vérification TypeScript
npx tsc --noEmit

# Tests d'intégration
npm run test

# Audit de sécurité
npm audit
```

## Maintenance

### Mise à Jour Better Auth

1. Vérifier les breaking changes
2. Mettre à jour les schémas de base de données
3. Tester tous les flux d'authentification
4. Vérifier les nouvelles recommandations de sécurité

### Monitoring

- Surveiller les tentatives d'accès non autorisées
- Logs des redirections de sécurité
- Métriques de performance du middleware

Cette stratégie multicouche garantit une sécurité robuste tout en maintenant une excellente expérience utilisateur.