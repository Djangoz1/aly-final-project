# Lien 

<a href='https://sepolia.etherscan.io/'> Etherscan sepolia</a>

## Hardhat
$Rappel$ 
- **Pour copier le dossier :**
```jsx 
cp -r /boilerplate/hardhat <nouveau-dossier>

```


```jsx
npm install ethers  @nomiclabs/hardhat-etherscan @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```


```jsx
npx hardhat 
```

```jsx
npx hardhat node --hostname 127.0.0.1
```
```jsx
npx hardhat compile
```

```jsx
npx hardhat run scripts/deploy.js --network localhost
// ou
npx hardhat run scripts/deploy.js --network sepolia
// ou
npx hardhat run scripts/deploy.js --network goerli
```

Pour vérifier le contrat sur etherscan  (avoir acces au code ):
```jsx
npx hardhat verify --network <address du contrat> <param constructeur>
```

## Test 

*Pour lancer le coverage :*
```shell
npx hardhat coverage
```





### Configuration

> hardhat-config.json

```jsx
module.exports = {
  solidity: "0.8.4",
  paths: { artifacts: "./src/artifacts" },
  networks: { hardhat: { chainId: 1337 } },
};
```