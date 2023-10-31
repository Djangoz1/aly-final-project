import { MENUS } from "constants/menus";

export let MENU_LAUNCHPAD = {
  edit: [
    { i: "👤", title: "Token" },
    { i: "🫂", title: "Social" },
    { i: "👨‍💻", title: "Work" },
    { i: "🔌", title: "Blockchain" },
  ],

  create: [
    { i: "ℹ️", title: "Introduction" },
    { i: "🗂️", title: "Information personnelle" },
    { i: "💰", title: "Token" },
    { i: "🔌", title: "Blockchain" },
    { i: "🤖", title: "L'IA Aly" },
  ],
};

// ********** ------ ********** //
// ********** Create ********** //
// ********** ------ ********** //

export let _form_create_launchpad_intro = {
  title: `${MENU_LAUNCHPAD.create[0].i} ${MENU_LAUNCHPAD.create[0].title}`,
  description: (
    <>
      <h6 className=" c1">🚀 Créez Votre Propre Launchpad !</h6>
      <br />
      Bienvenue dans notre univers de la crypto ! 🌌 Sur notre plateforme, tout
      le monde a le pouvoir de devenir un pionnier en créant son propre
      launchpad. Voici comment ça marche en trois étapes simples :
      <br />
      <br />
      <h6 className=" c1">🌟 La Création du Launchpad</h6>
      <br />
      Inscrivez-vous sur notre site en toute simplicité. Concevez votre
      launchpad personnalisé en définissant les règles et les objectifs.
      Donnez-lui un nom accrocheur et choisissez des cryptomonnaies compatibles.
      <br />
      <br />
      <h6 className=" c1">🚀 Le lancement Épique</h6>
      <br /> Annoncez votre launchpad à notre communauté passionnée. Les
      contributeurs investissent dans vos projets en utilisant des cryptos
      exclusives à notre site. Le compte à rebours commence, et la collecte de
      fonds décolle !
      <br />
      <br />
      <h6 className=" c1">💼 Engagez des Freelances Talentueux</h6>
      <br /> Une fois la collecte terminée avec succès, les fonds récoltés sont
      automatiquement transférés sur votre compte. Utilisez ces fonds
      exclusivement sur notre plateforme pour engager des freelances talentueux.
      Transformez vos idées en réalité grâce à une équipe de rêve.
      <br />
      <br /> Prêt à créer votre propre aventure crypto et à donner vie à vos
      projets ? Rejoignez-nous dès aujourd'hui et explorez les possibilités
      infinies de notre launchpad ! 🌠💰
    </>
  ),
};

export let _form_create_profile_info = {
  title: `${MENU_LAUNCHPAD.create[1].i} ${MENU_LAUNCHPAD.create[1].title}`,
  description: (
    <>
      Veuillez compléter les informations suivantes pour une meilleur
      expérience. <br />
      Ces informations sont réunis dans un but purement informatif et ne seront
      pas stocké dans la blockchain et n'auras aucune incidence sur le
      protocole.
    </>
  ),
};

export let _form_create_launchpad_token = {
  title: `${MENU_LAUNCHPAD.create[2].i} ${MENU_LAUNCHPAD.create[2].title}`,

  description: (
    <>
      <h6 className="c1 font-semibold">
        🚀 Explorez l'Univers des Tokens ERC-20
      </h6>
      <br />
      Notre launchpad vous ouvre les portes de l'univers passionnant des tokens
      ERC-20, les pierres précieuses du monde crypto !
      <br />
      <br />
      🌟 Pour participer à nos opportunités de financement et d'investissement,
      voici ce que vous devez savoir :
      <br />
      <br />
      <h6 className="c1 font-semibold">Tokens ERC-20 💎</h6>
      <br />
      Notre launchpad prend en charge exclusivement les tokens ERC-20, qui sont
      parmi les plus répandus et les plus fiables de l'écosystème blockchain.
      Les projets hébergés sur notre plateforme utilisent principalement des
      tokens ERC-20 pour leurs campagnes de financement.
      <br />
      <br />
      <h6 className="c1 font-semibold">L'Étape Cruciale : L'Allowance 📈</h6>
      <br />
      Avant de commencer à investir dans les projets de notre launchpad, vous
      devez confier une "allowance" au contrat du launchpad. L'allowance est une
      autorisation que vous accordez pour que le contrat du launchpad puisse
      gérer vos tokens ERC-20 lors de votre participation aux campagnes. Cette
      étape est essentielle pour garantir un processus de financement en toute
      sécurité.
      <br />
      <br />
      <h6 className="c1 font-semibold">Soyez Prêt à Investir 💰</h6>
      <br />
      Une fois que vous avez configuré l'allowance, vous êtes prêt à configurer
      votre launchpad. Investissez dans les campagnes qui vous intéressent en
      utilisant vos tokens ERC-20, en toute confiance, grâce à notre mécanisme
      sécurisé. Nous vous invitons à vous plonger dans le monde des tokens
      ERC-20 sur notre launchpad et à proposer à notre communauté de financer
      votre projet.
      <br />
      <br />
      Assurez-vous de bien gérer votre allowance pour participer commencer en
      toute sécurité à récolté des fonds pour votre projet! 🌐🔒
    </>
  ),
};
export let _form_create_launchpad_blockchain = {
  title: `${MENU_LAUNCHPAD.create[2].i} ${MENU_LAUNCHPAD.create[2].title}`,

  description: (
    <>
      <h6 className="c1 font-semibold">
        🚀 Explorez l'Univers des Tokens ERC-20
      </h6>
      <br />
      Notre launchpad vous ouvre les portes de l'univers passionnant des tokens
      ERC-20, les pierres précieuses du monde crypto !
      <br />
      <br />
      🌟 Pour participer à nos opportunités de financement et d'investissement,
      voici ce que vous devez savoir :
      <br />
      <br />
      <h6 className="c1 font-semibold">Tokens ERC-20 💎</h6>
      <br />
    </>
  ),
};
export let _form_create_launchpad_resume = {
  title: `${MENU_LAUNCHPAD.create[3].i} ${MENU_LAUNCHPAD.create[3].title}`,

  description: (
    <>
      <h6 className="c1 font-semibold">
        🚀 Explorez l'Univers des Tokens ERC-20
      </h6>
      <br />
      Notre launchpad vous ouvre les portes de l'univers passionnant des tokens
      ERC-20, les pierres précieuses du monde crypto !
      <br />
      <br />
      🌟 Pour participer à nos opportunités de financement et d'investissement,
      voici ce que vous devez savoir :
      <br />
      <br />
      <h6 className="c1 font-semibold">Tokens ERC-20 💎</h6>
      <br />
    </>
  ),
};

export let _form_create_launchpad = [
  _form_create_launchpad_intro,
  _form_create_profile_info,
  _form_create_launchpad_token,
  _form_create_launchpad_blockchain,
  _form_create_launchpad_resume,
];

export let _form_edit_launchpad_lock_token = {
  title: `${MENU_LAUNCHPAD.edit[0].i} ${MENU_LAUNCHPAD.create[0].title}`,

  description: (
    <>
      <h6 className="c1 font-semibold">
        🚀 Explorez l'Univers des Tokens ERC-20
      </h6>
      <br />
      Notre launchpad vous ouvre les portes de l'univers passionnant des tokens
      ERC-20, les pierres précieuses du monde crypto !
      <br />
      <br />
      🌟 Pour participer à nos opportunités de financement et d'investissement,
      voici ce que vous devez savoir :
      <br />
      <br />
      <h6 className="c1 font-semibold">Tokens ERC-20 💎</h6>
      <br />
      Notre launchpad prend en charge exclusivement les tokens ERC-20, qui sont
      parmi les plus répandus et les plus fiables de l'écosystème blockchain.
      Les projets hébergés sur notre plateforme utilisent principalement des
      tokens ERC-20 pour leurs campagnes de financement.
      <br />
      <br />
      <h6 className="c1 font-semibold">L'Étape Cruciale : L'Allowance 📈</h6>
      <br />
      Avant de commencer à investir dans les projets de notre launchpad, vous
      devez confier une "allowance" au contrat du launchpad. L'allowance est une
      autorisation que vous accordez pour que le contrat du launchpad puisse
      gérer vos tokens ERC-20 lors de votre participation aux campagnes. Cette
      étape est essentielle pour garantir un processus de financement en toute
      sécurité.
      <br />
      <br />
      <h6 className="c1 font-semibold">Soyez Prêt à Investir 💰</h6>
      <br />
      Une fois que vous avez configuré l'allowance, le protocole aura le
      nécessaire pour mener à bien le contrat. Les chercheurs de projets
      pourront investir une fois la date de début atteinte
      <br />
      <br />
      Il faut pour cela deux transaction. L'une pour le protocole ERC20 qui
      donneras l'allowance au contrat et une pour avertir le contrat de son
      allowance🌐🔒
    </>
  ),
};
