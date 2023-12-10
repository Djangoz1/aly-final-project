**Ne pas oublier de renseigner le .env**
Install pocketbase

```bash
./pocketbase serve
```

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

# Blockchain

## Test

```bash
cd backend
npx hardhat test
```

Tout les getter pour un user sont sur les contrats :
`/backend/contracts/system/APIGet.sol`
Tout les setter pour un user sont sur les contrats :
`/backend/contracts/system/APIPost.sol`

**1 - Déployer les contrats**

```bash
cd backend
npx hardhat node
npm run fuzzing
# Attendre le déploiement des contrats
```

**1 - Lancer l'app**

```bash
yarn dev
# npm run dev
```

Il faut avoir l'extension metamask d'installer

- Clicker sur connect wallet
- Se connecter sur le réseau localhost

Page qui fonctionne

- `/`
- `/profile/${id}`
- `/profile/${id}/missions`
- `/profile/${id}/pubs`
- `/mission/${id}`
- `/mission/${id}/features`
