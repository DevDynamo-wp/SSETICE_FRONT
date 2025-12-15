# SSETICE_FRONT

> Instructions pour cloner et déployer l'application en local

Cette application front-end (principalement TypeScript, CSS, JavaScript et HTML) se trouve dans le dépôt `DevDynamo-wp/SSETICE_FRONT`. Ce README explique comment cloner le repo, installer les dépendances et lancer l'application en local.

## Prérequis

- Git (pour cloner le dépôt)
- Node.js (version recommandée : 14.x, 16.x ou 18.x — vérifier la version requise dans `package.json` ou `.nvmrc` si présent)
- npm ou yarn (npm >= 6 / yarn >= 1.22)
- (Optionnel) Docker & Docker Compose si vous préférez lancer via des conteneurs

Vérifier les versions :
```bash
git --version
node --version
npm --version
# ou
yarn --version
```

## Cloner le dépôt

Ouvrez un terminal et lancez :
```bash
git clone https://github.com/DevDynamo-wp/SSETICE_FRONT.git
cd SSETICE_FRONT
```

## Installation des dépendances

Avec npm :
```bash
npm install
```

Avec yarn :
```bash
yarn install
```

Si le projet utilise un gestionnaire de paquets spécifique (pnpm, yarn berry...), adaptez la commande.

## Configuration des variables d'environnement

Créez un fichier `.env` à la racine si nécessaire. Il est courant d'avoir un fichier `.env.example` dans le repo ; si présent, copiez-le :

```bash
cp .env.example .env
```

Exemple générique de `.env` (adapter selon le projet) :
```env
# URL de l'API back-end
VITE_API_URL=https://api.example.com

# Port local (si applicable)
VITE_DEV_PORT=5173

# Autres variables (clé publique, feature flags...)
REACT_APP_SOME_KEY=your_value
```

Remplacez les valeurs par celles adaptées à votre environnement.

> Remarque : le préfixe des variables peut dépendre du bundler/framework (ex. `VITE_` pour Vite, `REACT_APP_` pour Create React App). Vérifiez le code ou `package.json` pour connaître les attentes.

## Lancer l'application en local

Regardez d'abord les scripts définis dans `package.json` :
```bash
cat package.json | grep -A2 '"scripts"'
```

Commandes usuelles :

Développement (hot-reload) :
```bash
# npm
npm run dev

# ou pour CRA
npm start

# avec yarn
yarn dev
# ou
yarn start
```

Build de production :
```bash
npm run build
# ou
yarn build
```

Tester localement le build (serveur statique simple) :
```bash
# installer un serveur statique globalement si nécessaire
npm install -g serve
serve -s dist
# ou
npx serve -s dist
```

Les ports par défaut dépendent du framework (ex. Vite 5173, CRA 3000). Le terminal affichera l'URL locale (ex. http://localhost:5173).

## Docker (optionnel)

Exemple générique de build et run Docker (adapter le Dockerfile du repo s'il existe) :

```bash
# construire l'image
docker build -t ssetice_front:latest .

# lancer le conteneur (expose le port 3000 -> 3000)
docker run -it --rm -p 3000:3000 --name ssetice_front ssetice_front:latest
```

Si un fichier `docker-compose.yml` est fourni :
```bash
docker-compose up --build
```

## Tests & Lint

Si le projet contient des scripts pour tests ou lint :
```bash
npm run test
npm run lint
# ou
yarn test
yarn lint
```

Consultez `package.json` pour les scripts exacts.

## Dépannage (FAQ rapide)

- Si `npm install` échoue : supprimez `node_modules` et `package-lock.json` (ou `yarn.lock`) puis réinstallez :
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Erreurs sur les variables d'environnement : vérifiez le préfixe attendu (`VITE_`, `REACT_APP_`, etc.) et que `.env` est bien à la racine.
- Port déjà utilisé : changez le port dans `.env` ou kill le processus occupant le port.
- Problèmes TypeScript : vérifiez la version de Node et exécutez `npm run build` pour voir les erreurs de compilation.

## Structure & technologies

Langages principaux du projet :
- TypeScript
- CSS
- JavaScript
- HTML

Consultez l'arborescence du projet pour plus de détails sur la structure (ex. `src/`, `public/`, `components/`).

## Contribution

1. Forkez le dépôt
2. Créez une branche descriptive : `git checkout -b feat/ma-fonctionnalite`
3. Faites vos changements, committez : `git commit -m "feat: description"`
4. Poussez et ouvrez une Pull Request

Respectez les règles de style et les tests existants.

## Licence & contact

Indiquez ici la licence du projet (vérifiez si un fichier `LICENSE` existe).  
Pour toute question, contactez les mainteneurs du dépôt via les issues GitHub : https://github.com/DevDynamo-wp/SSETICE_FRONT/issues

---

J'ai généré ce README de base pour cloner et lancer l'application localement. Si vous voulez, je peux :
- adapter le contenu aux scripts réels du `package.json` (donnez-moi son contenu ou autorisez-moi à le lire),
- produire un `.env.example` précis,
- ajouter des instructions Dockerfile/docker-compose basées sur les fichiers du repo. Dites-moi ce que vous préférez.
