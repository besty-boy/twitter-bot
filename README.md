# Twitter/X Bot - Script de Liking Automatique

Ce projet est un script Node.js utilisant Puppeteer pour automatiser l'interaction avec des tweets dans une communauté Twitter/X spécifique pour le fichier like-community.js, et un script d'automatisation de like pour un tweet précis pour like-tweet.js. Le bot se connecte à votre compte, navigue vers une communauté prédéfinie et like les tweets récents tout en évitant les tweets épinglés.

## Prérequis

- Node.js (version 16 ou supérieure)
- NPM ou Yarn
- Compte Twitter/X valide
- Communauté Twitter/X accessible (lien URL)

## Installation

1. Clonez le dépôt ou copiez les fichiers à partir de ce projet.
   ```bash
   git clone <URL_DU_DEPOT>
   cd x-bot
   ```

2. Installez les dépendances :
   ```bash
   npm install puppeteer
   ```

## Configuration

Créez ou modifiez les variables dans le script :

```javascript
const COMMUNITY_URL = 'https://x.com/i/communities/<COMMUNITY_ID>'; // Remplacez <COMMUNITY_ID> par l'ID de votre communauté
const USERNAME = '@VotreNomUtilisateur';
const PASSWORD = 'VotreMotDePasse';
```

## Utilisation

Lancez le script avec Node.js :

```bash
node index.js
```

## Fonctionnement

1. **Connexion** :
   - Se connecte à votre compte Twitter/X avec vos identifiants.

2. **Navigation** :
   - Va directement à l'URL de la communauté.
   - Clique sur l'onglet "Latest" pour voir les tweets les plus récents.

3. **Liking Automatique** :
   - Parcourt les tweets disponibles.
   - Ignore les tweets épinglés.
   - Like les tweets qui n'ont pas encore été likés.
   - Attend un intervalle défini (par défaut 100 secondes) avant de relancer la recherche.

## Personnalisation

- **Cooldown** :
  Ajustez l'intervalle entre deux recherches en modifiant la valeur suivante (en millisecondes) :
  ```javascript
  await new Promise(resolve => setTimeout(resolve, 100000));
  ```

- **Filtrage des tweets** :
  Vous pouvez personnaliser les critères de sélection des tweets en modifiant les conditions dans cette section :
  ```javascript
  const isPinned = await tweet.evaluate(el =>
    el.innerText.includes('Pinned by Community mods')
  );
  ```

## Limitations

- Le bot fonctionne mieux sur des communautés actives où des tweets récents sont publiés régulièrement.
- Twitter/X peut bloquer ou limiter l'accès aux bots si trop d'actions sont effectuées en peu de temps.

## Avertissement

L'utilisation de bots pour automatiser des interactions sur Twitter/X peut être contraire à leurs conditions d'utilisation. Utilisez ce script de manière responsable et à vos propres risques.

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

