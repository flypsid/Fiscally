# Guide de Diagnostic - Problème d'Envoi d'Email

## Problème Identifié

L'inscription d'utilisateur réussit (utilisateur créé en base) mais l'email de vérification n'est pas envoyé, causant un état incohérent.

## Solutions Appliquées

### 1. Amélioration des Logs

- ✅ Ajout de logs détaillés dans `sendVerificationEmail()`
- ✅ Ajout de logs dans la configuration Better Auth
- ✅ Gestion d'erreur améliorée pour éviter l'échec silencieux

### 2. Correction du Flux d'Inscription

- ✅ Redirection vers `/verify-email` au lieu de `/dashboard` après inscription
- ✅ Gestion d'erreur non-bloquante pour l'envoi d'email

### 3. Corrections des Traductions

- ✅ Nettoyage des doublons dans `messages/fr.json`
- ✅ Ajout des traductions manquantes

## 🔍 Diagnostic Complet

### ✅ PROBLÈME IDENTIFIÉ : Domaine Non Vérifié

**Statut** : Le script de test révèle que le domaine `fiscally.app` n'est pas vérifié dans Resend.

**Erreur Resend** :

```
❌ Erreur Resend: {
  statusCode: 403,
  error: 'The fiscally.app domain is not verified. Please, add and verify your domain on https://resend.com/domains',
  name: 'validation_error'
}
```

### 1. Vérifier les Variables d'Environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
# Resend API
RESEND_API_KEY=re_xxxxxxxxxx

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...
```

✅ **Résultat** : Toutes les variables sont présentes dans `.env`

### 2. Tester l'Envoi d'Email

Exécutez le script de test :

```bash
node test-email.js
```

### 3. Vérifier les Logs

Après une tentative d'inscription, vérifiez les logs dans la console pour :

- `"Better Auth: Attempting to send verification email for user:"`
- `"Starting email verification send process:"`
- `"Email HTML rendered successfully"`
- `"Verification email sent successfully:"`

Ou des erreurs comme :

- `"Resend API error:"`
- `"Better Auth: Failed to send verification email"`

### 4. 🚨 SOLUTIONS

#### ✅ Solution Immédiate : Utiliser un Email de Test

Pour tester rapidement, modifiez temporairement `src/lib/email.ts` :

```typescript
// Remplacez temporairement dans sendVerificationEmail :
const { data, error } = await resend.emails.send({
  from: "onboarding@resend.dev", // ← Email de test Resend
  to,
  subject: getSubject("emailVerification", locale),
  html,
});
```

#### 🔧 Solution Permanente : Vérifier le Domaine

1. **Connectez-vous à Resend Dashboard** : https://resend.com/domains
2. **Ajoutez le domaine** `fiscally.app`
3. **Configurez les enregistrements DNS** selon les instructions Resend
4. **Attendez la vérification** (peut prendre quelques heures)

#### 🏃‍♂️ Solution Alternative : Domaine Personnel

Si vous possédez un autre domaine vérifié :

```typescript
// Dans src/lib/email.ts, changez :
from: 'noreply@votre-domaine-verifie.com',
```

### 5. Problèmes Courants

#### ✅ A. Domaine Non Vérifié (RÉSOLU)

- **Cause** : `fiscally.app` non vérifié dans Resend
- **Solution** : Voir solutions ci-dessus

#### B. Clé API Resend Invalide

- Vérifiez que votre clé API Resend est correcte
- Régénérez une nouvelle clé si nécessaire

#### C. Limites de Resend

- Plan gratuit : 100 emails/jour
- Vérifiez votre quota
- En mode sandbox, vous ne pouvez envoyer qu'à votre email vérifié

### 5. Test Manuel

Pour tester manuellement l'envoi d'email :

1. Créez un compte
2. Vérifiez les logs de la console
3. Si aucun email n'est reçu, utilisez le bouton "Renvoyer l'email de vérification" sur `/verify-email`

### 6. Solution Temporaire

Si le problème persiste, vous pouvez temporairement désactiver la vérification d'email :

Dans `src/lib/auth.ts` :

```javascript
emailAndPassword: {
  enabled: true,
  requireEmailVerification: false, // Temporairement false
  // ...
},
```

## Prochaines Étapes

1. Exécutez le script de test
2. Tentez une nouvelle inscription
3. Vérifiez les logs
4. Rapportez les erreurs spécifiques trouvées

## Nettoyage

Après résolution, supprimez :

- `test-email.js`
- `DEBUG-EMAIL.md`
