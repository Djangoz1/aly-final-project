const { getContractAt } = require("../helpers/test_init");
const {
  FEATURE_DATAS_EXEMPLE,
  CV_DATAS_URI_EXEMPLE,
} = require("../helpers/test_utils");
const {
  createURICV,
  createURIMission,
  createURIFeature,
  createURIPub,
} = require("./pinata");

let _createCV = async (name, account, addressSystem) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrG = await _iAS.apiGet();
  let _addrP = await _iAS.apiPost();

  let apiGet = await getContractAt("APIGet", _addrG);
  let apiPost = await getContractAt("APIPost", _addrP);

  let id = parseInt(await apiGet.lengthOfCVs()) + 1;
  let result = await createURICV({
    id,
    name,
  });

  await apiPost.connect(account).createCV(result.IpfsHash);

  let _id = await apiGet.cvOf(account.address);
  if (id != _id) {
    result = await createURICV({
      id: _id,
      name,
    });
    console.log("Error ID -----", _id);
  }
  return _id;
};

let _createMission = async ({
  title,
  description,
  account,
  social,
  reference,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrMH = await _iAS.missionsHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );

  let id = parseInt(await apiGet.tokensLengthOf(_addrMH)) + 1;

  let result = await createURIMission({
    id,
    title,
    description,
    attributes: social || reference ? [{ social, reference }] : null,
    social,
  });

  await apiPost.connect(account).createMission(result.IpfsHash, {
    value: `${await balancesHub.missionPrice()}`,
  });

  await _createPub({
    img: false,
    missionID: id,
    addressSystem,
    account,
    description: `Titre de la Mission : Conception d'un Site Web Élégant pour une Petite Entreprise de Café
    Description de la Mission:
    Nous sommes à la recherche d'un talentueux concepteur de site Web pour créer une présence en ligne exceptionnelle pour notre petite entreprise de café, 'Café Délicieux'. Notre objectif est de mettre en avant notre atmosphère chaleureuse et notre délicieux café artisanal pour attirer davantage de clients et d'amateurs de café.

    Tâches Principales :
    Conception du Site Web : Concevoir un site Web moderne et attrayant qui reflète notre identité de marque. Le site doit être convivial, accessible sur tous les appareils, et optimisé pour une expérience utilisateur exceptionnelle.
    Galerie de Photos : Créer une galerie de photos mettant en valeur notre café, nos boissons, et notre ambiance. Les images devront être de haute qualité pour susciter l'appétit et l'intérêt des visiteurs.
    Menu en Ligne : Intégrer un menu en ligne complet, facile à naviguer, avec des descriptions de produits, des prix et la possibilité de personnaliser les commandes.
    Intégration des Réseaux Sociaux : Connecter le site Web à nos profils de médias sociaux pour une présence en ligne cohérente. Les boutons de partage doivent également être intégrés pour encourager la diffusion de notre contenu.
    Formulaire de Contact : Inclure un formulaire de contact pour permettre aux clients de poser des questions, de faire des réservations ou de laisser des commentaires.
    Blog sur le Café : Créer une section blog où nous pourrons partager des articles sur le café, des recettes, et des histoires liées à notre entreprise.
    Conditions de la Mission :
    Date de début : À convenir
    Délai de livraison : [Insérer la date limite]
    Budget : [Insérer votre budget]
    Nous recherchons un freelance créatif et expérimenté en conception de site Web, ayant une passion pour le café et une compréhension de l'industrie alimentaire. Si vous êtes prêt à créer un site Web qui éveillera les papilles gustatives de nos clients, nous aimerions entendre parler de vous !
    Si cette mission vous intéresse, n'hésitez pas à nous contacter avec des exemples de vos travaux antérieurs et votre proposition. Nous avons hâte de travailler avec un professionnel talentueux pour donner vie à notre vision en ligne.`,
  });

  if (account.address != (await apiGet.ownerOfToken(id, _addrMH))) {
    throw new Error("Error Missions: URI ID");
  }
  return id;
};

let _createFeature = async ({
  missionID,
  estimatedDays,
  isInviteOnly,
  specification,
  title,
  description,
  account,
  accounts,
  wadge,
  domain,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrFH = await _iAS.featuresHub();

  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());
  let balancesHub = await getContractAt(
    "BalancesHub",
    await _iAS.balancesHub()
  );
  let _missionID =
    missionID || (await _createMission({ account, addressSystem }));

  let featureID = parseInt(await apiGet.tokensLengthOf(_addrFH)) + 1;
  let moock = FEATURE_DATAS_EXEMPLE;
  let result = await createURIFeature({
    id: featureID,
    title,
    description,
    attributes: { domain },
  });

  await apiPost
    .connect(account)
    .createFeature(
      _missionID,
      estimatedDays || moock?.estimatedDays,
      isInviteOnly || moock?.isInviteOnly,
      result.IpfsHash,
      specification || moock?.specification,
      {
        value: `${wadge || (await balancesHub.missionPrice())}`,
      }
    );

  if (account.address != (await apiGet.ownerOfToken(featureID, _addrFH))) {
    throw new Error("Error Feature: URI ID");
  }

  if (accounts?.length > 0) {
    const _account = accounts[0];
    let cvID = await apiGet.cvOf(_account.address);
    await apiPost.connect(account).inviteWorker(cvID, featureID);
    await apiPost.connect(_account).acceptJob(featureID);

    console.log(cvID, " is worker");
  }

  return { id: featureID, missionID: _missionID };
};

let _createPub = async ({
  missionID,
  answerID,
  title,
  description,
  account,
  img,
  addressSystem,
}) => {
  let _iAS = await getContractAt("AddressSystem", addressSystem);
  let _addrPH = await _iAS.pubsHub();
  let apiGet = await getContractAt("APIGet", await _iAS.apiGet());
  let apiPost = await getContractAt("APIPost", await _iAS.apiPost());

  let id = parseInt(await apiGet.tokensLengthOf(_addrPH)) + 1;
  let result = await createURIPub({
    id,
    title,
    img,
    description,
    missionID,
    answerID,
    owner: account.address,
  });

  if (missionID && missionID > 0) {
    await apiPost.connect(account).createPubMission(missionID, result.IpfsHash);
  } else if (answerID && answerID > 0) {
    await apiPost.connect(account).createPubAnswer(answerID, result.IpfsHash);
  } else {
    await apiPost.connect(account).createPub(result.IpfsHash);
  }

  if (account.address != (await apiGet.ownerOfToken(id, _addrPH))) {
    throw new Error("Error Pub: URI ID");
  }
  return id;
};

module.exports = { _createCV, _createMission, _createFeature, _createPub };
