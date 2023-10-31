import { Icon } from "@iconify/react";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { icfy } from "icones";

let MENUS = {
  feature: {
    create: [
      { i: "ℹ️", title: "Introduction" },
      { i: "🗂️", title: "Informations" },
      { i: "🔌", title: "Blockchain" },
      { i: "🤖", title: "L'IA Aly" },
    ],
  },
};

export let _form_create_feature_intro = {
  title: <>Salut ! 👋</>,
  description: (
    <>
      Je m'appelle Aly je suis votre ami virtuel qui vous accompagnera tout au
      long du processus de recherche et de création de mission pour trouver le
      freelance parfait. Mon objectif est de rendre cette expérience aussi
      fluide et agréable que possible pour vous.
      <br />
      <br />
      <span className="c1">
        🔍 Conseils pour la rédaction de votre mission :
      </span>
      <br />
      Je vais vous poser quelques questions clés pour comprendre vos besoins, et
      en fonction de vos réponses, je vous aiderai à rédiger une description de
      mission claire et concise.
      <br />
      <br />
      <span className="c1">📅 Planification et gestion des délais :</span>
      <br />
      Une fois votre mission créée, je vous aiderai à définir des délais
      réalistes et à établir un calendrier pour suivre le progrès de votre
      projet.
      <br />
      <br />
      <span className="c1">👥 Recherche de freelances :</span>
      Je vous orienterai vers les plateformes de freelance populaires où vous
      pourrez trouver des talents correspondant à vos besoins spécifiques.
      <br />
      <br />
      <br />
      <span className="c1">📧 Communication avec les freelances :</span>
      Je vous donnerai des conseils sur la communication efficace avec les
      freelances, y compris les questions à poser lors de l'entretien et les
      <br />
      étapes à suivre pour conclure un contrat.
      <br />
      <br />
      <span className="c1">🔒 Sécurité et confidentialité :</span>
      Vos informations sont en sécurité avec moi. Je prends la confidentialité
      au sérieux et ne partagerai aucune donnée personnelle.
      <br />
      <br />
      <br />
      <span className="c1">💬 Support continu :</span>
      Je suis disponible 24/7 pour répondre à vos questions et vous aider à
      résoudre tout problème qui pourrait survenir lors de votre recherche de
      <br />
      freelance. N'hésitez pas à me poser des questions ou à demander de l'aide
      à tout moment. Je suis là pour vous guider dans votre quête du freelance
      idéal.
      <br />
      <br />
      <span className="c1">
        Je te laise commencer et je reviendrais vers toi avant que tu ne
        confirme 😄
        <br />
      </span>
    </>
  ),
};

export let _form_create_feature_info = {
  title: `${MENUS?.feature?.create?.[1].i} ${MENUS?.feature?.create?.[1].title}`,

  description: (
    <>
      Attention ! Ces informations ne sont pas stockés dans la blockchain et
      n'ont pas d'incidence sur le protocole.
      <br />
      Elles n'ont qu'un but purement informatif afin d'attirer des freelancers.
    </>
  ),
};

export let _form_create_feature_blockchain = {
  title: `${MENUS?.feature?.create?.[2].i} ${MENUS?.feature?.create?.[2].title}`,
  info: (
    <div className="flex w-full text-warning  text-justify text-xs flex-col">
      <div className="text-lg w-fit flex items-center">
        <Icon icon={icfy.ux.warning} className="mr-3" /> Attention !
      </div>
      Toutes les informations suivantes auront une incidence sur le protocole.
      Veuillez bien vérifier toutes les données avant de confirmer afin d'éviter
      toutes erreurs
    </div>
  ),
  description: (
    <>
      <h6 className="c1 font-bold text-lg flex items-center">
        <Icon icon={icfy.eye.open} className="mr-3 text-lg" />
        Visibilité
      </h6>

      <p>
        <br />
        Souhaitez vous ouvrir les postulations pour ce poste
        <br />
        <br />
        <span className="c1 font-bold ">Si vous acceptez, </span>
        vous serez en capacité d'ouvrir ce poste à la candidature et vous pourez
        ensuite signé celui que vous souhaiterez.
        <br />
        <span className="c1 font-bold ">Si vous refusez, </span>
        vous ne pourrais pas recevoir les candidatures et vous devrez d'abord
        proposer ce poste à un freelancer qui choisiras d'accepter ou non .
        <br />
        <br />
        Veuillez choisir correctement la
        <span className="c1 font-bold "> spécification </span>
        car celle-ci seras déterminante en cas de
        <span className="c1 font-bold "> litiges</span>.
        <br />
        <br />
        En cas de litige, le protocole enverras le dossier directement à la
        <span className="c1 font-bold "> court lié à la spécification</span>
        .
        <br />
        La court est composé de jurys qui ont de l'expérience sur cette
        spécification.
      </p>
      <MyToggle style={"mt-10"} target={"onlyInvite"}>
        Seulement sur invitation
      </MyToggle>
    </>
  ),
};

export let _form_create_feature_resume = {
  title: `${MENUS?.feature?.create?.[3].i} ${MENUS?.feature?.create?.[3].title}`,

  description: (
    <>
      <p>
        Tu souhaites créer une feature pour ta mission :
        <span className="c1 ml-1">Mission name</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="c1 ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel domaine pour cette feature :
        <span className="c1 ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="c1 ml-1">Javascript</span>.
        <br />
        <br />
        Tu estimes à<span className="c1 ml-1"> 10 jours </span> le temps de
        conception.
        <br />
        <br />
        Tu payes
        <span className="c1 ml-1"> 0.3 ETH </span> pour la livraison de cette
        feature. Tu payes:
        <span className="c1 ml-1">Javascript</span>.
        <br />
        <br />
        Je vais vous poser quelques questions clés pour comprendre vos besoins,
        et en fonction de vos réponses, je vous aiderai à rédiger une
        description de mission claire et concise.
        <br />
        <br />
        <span className="c1">
          Je te laise commencer et je reviendrais vers toi avant que tu ne
          confirme 😄
          <br />
        </span>
      </p>
      <MyToggle style={"mt-10"} target={"ia"}>
        Suivre recommandation
      </MyToggle>
    </>
  ),
};

export let _form_create_feature = [
  _form_create_feature_intro,
  _form_create_feature_info,
  _form_create_feature_blockchain,
  _form_create_feature_resume,
];
