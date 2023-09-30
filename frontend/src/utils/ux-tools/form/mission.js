import { Icon } from "@iconify/react";
import { CVName } from "components/inputs/inputsCV/CVName";

import { _apiPostAt } from "utils/ui-tools/web3-tools";
let MENUS = [
  { i: "ℹ️", title: "Introduction" },
  { i: "🗂️", title: "Informations" },
  { i: "🔌", title: "Blockchain" },
  { i: "🤖", title: "L'IA Aly" },
];
export let _form_create_mission_intro = {
  title: (
    <>
      Salut <CVName /> ! 👋
    </>
  ),
  description: (
    <>
      Je m'appelle Aly je suis votre ami virtuel qui vous accompagnera tout au
      long du processus de recherche et de création de mission pour trouver le
      freelance parfait. Mon objectif est de rendre cette expérience aussi
      fluide et agréable que possible pour vous.
      <br />
      <br />
      <span className="text-white">
        🔍 Conseils pour la rédaction de votre mission :
      </span>
      Je vais vous poser quelques questions clés pour comprendre vos besoins, et
      en fonction de vos réponses, je vous aiderai à rédiger une description de
      mission claire et concise.
      <br />
      <br />
      <span className="text-white">
        📅 Planification et gestion des délais :
      </span>
      Une fois votre mission créée, je vous aiderai à définir des délais
      réalistes et à établir un calendrier pour suivre le progrès de votre
      projet.
      <br />
      <br />
      <span className="text-white">👥 Recherche de freelances :</span>
      Je vous orienterai vers les plateformes de freelance populaires où vous
      pourrez trouver des talents correspondant à vos besoins spécifiques.
      <br />
      <br />
      <span className="text-white">📧 Communication avec les freelances :</span>
      Je vous donnerai des conseils sur la communication efficace avec les
      freelances, y compris les questions à poser lors de l'entretien et les
      étapes à suivre pour conclure un contrat.
      <br />
      <br />
      <span className="text-white">🔒 Sécurité et confidentialité :</span>
      Vos informations sont en sécurité avec moi. Je prends la confidentialité
      au sérieux et ne partagerai aucune donnée personnelle.
      <br />
      <br />
      <span className="text-white">💬 Support continu :</span>
      Je suis disponible 24/7 pour répondre à vos questions et vous aider à
      résoudre tout problème qui pourrait survenir lors de votre recherche de
      freelance. N'hésitez pas à me poser des questions ou à demander de l'aide
      à tout moment. Je suis là pour vous guider dans votre quête du freelance
      idéal.
      <br />
      <br />
      <span className="text-white">
        Je te laise commencer et je reviendrais vers toi avant que tu ne
        confirme 😄
      </span>
      <div className="text-error -mt-3 flex items-center ml-auto">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-success mr-2"
          checked
        />
        Désactiver
      </div>
    </>
  ),
};

export let _form_create_mission_info = {
  title: `${MENUS[1].i} ${MENUS[1].title}`,

  description: (
    <>
      ⚠️ Attention !
      <br />
      <br />
      Aucune de ces informations n'ont une incidence sur le protocole. Elles ne
      servent qu'à un but purement informative.
    </>
  ),
};

export let _form_create_mission_blockchain = {
  title: `${MENUS[2].i} ${MENUS[2].title}`,

  description: (
    <>
      Je suis disponible 24/7 pour répondre à vos questions et vous aider à
      résoudre tout problème qui pourrait survenir lors de votre recherche de
      freelance. N'hésitez pas à me poser des questions ou à demander de l'aide
      à tout moment. Je suis là pour vous guider dans votre quête du freelance
      idéal.
    </>
  ),
};

export let _form_create_mission_resume = {
  title: `${MENUS[3].i} ${MENUS[3].title}`,

  description: (
    <>
      <p>
        Tu souhaites créer une feature pour ta mission :
        <span className="text-white ml-1">Mission name</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="text-white ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel domaine pour cette feature :
        <span className="text-white ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="text-white ml-1">Javascript</span>.
        <br />
        <br />
        Tu estimes à<span className="text-white ml-1"> 10 jours </span> le temps
        de conception.
        <br />
        <br />
        Tu payes
        <span className="text-white ml-1"> 0.3 ETH </span> pour la livraison de
        cette feature. Tu payes:
        <span className="text-white ml-1">Javascript</span>.
        <br />
        <br />
        Je vais vous poser quelques questions clés pour comprendre vos besoins,
        et en fonction de vos réponses, je vous aiderai à rédiger une
        description de mission claire et concise.
        <br />
        <br />
        <span className="text-white">
          Je te laise commencer et je reviendrais vers toi avant que tu ne
          confirme 😄
        </span>
      </p>
      <div className="text-info -mt-3 flex items-center ml-auto">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-success mr-2"
          checked
        />
        Suivre recommandation
      </div>
    </>
  ),
};

export let _form_create_mission = [
  _form_create_mission_intro,
  _form_create_mission_info,
  _form_create_mission_blockchain,
  _form_create_mission_resume,
];
