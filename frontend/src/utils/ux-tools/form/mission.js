import { Icon } from "@iconify/react";
import { CVName } from "components/links/CVName";
import { MyToggle } from "components/myComponents/form/MyToggle";
import { icfy, icfyINFO } from "icones";

import { _apiPostAt } from "utils/ui-tools/web3-tools";
let MENUS = [
  { title: "Introduction" },
  { i: icfyINFO, title: "Informations" },
  { i: icfy.domain.blockchain, title: "Blockchain" },
  { i: icfy.domain.ai, title: "L'IA Aly" },
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
      <br />
      Je vous orienterai vers les plateformes de freelance populaires où vous
      pourrez trouver des talents correspondant à vos besoins spécifiques.
      <br />
      <br />
      <span className="c1">📧 Communication avec les freelances :</span>
      <br />
      Je vous donnerai des conseils sur la communication efficace avec les
      freelances, y compris les questions à poser lors de l'entretien et les
      étapes à suivre pour conclure un contrat.
      <br />
      <br />
      <span className="c1">🔒 Sécurité et confidentialité :</span>
      <br />
      Vos informations sont en sécurité avec moi. Je prends la confidentialité
      au sérieux et ne partagerai aucune donnée personnelle.
      <br />
      <br />
      <span className="c1">💬 Support continu :</span>
      <br />
      Je suis disponible 24/7 pour répondre à vos questions et vous aider à
      résoudre tout problème qui pourrait survenir lors de votre recherche de
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

export let _form_create_mission_info = {
  title: `${MENUS[1].title}`,
  icon: MENUS[1].i,

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
  title: `${MENUS[2].title}`,
  icon: MENUS[2].i,

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
  title: `${MENUS[3].title}`,
  icon: MENUS[3].i,

  description: (
    <>
      <p>
        Tu souhaites créer une feature pour ta mission :
        <span className="c1 font-semibold ml-1">Mission name</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="c1 font-semibold ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel domaine pour cette feature :
        <span className="c1 font-semibold ml-1">Javascript</span>.
        <br />
        <br />
        Tu as choisi tel langage pour cette feature :
        <span className="c1 font-semibold ml-1">Javascript</span>.
        <br />
        <br />
        Tu estimes à<span className="c1 font-semibold ml-1"> 10 jours </span> le
        temps de conception.
        <br />
        <br />
        Tu payes
        <span className="c1 font-semibold ml-1"> 0.3 ETH </span> pour la
        livraison de cette feature. Tu payes:
        <span className="c1 font-semibold ml-1">Javascript</span>.
        <br />
        <br />
        Je vais vous poser quelques questions clés pour comprendre vos besoins,
        et en fonction de vos réponses, je vous aiderai à rédiger une
        description de mission claire et concise.
        <br />
        <br />
        <span className="c1">
          <br />
          Je te laise commencer et je reviendrais vers toi avant que tu ne
          confirme 😄
        </span>
      </p>
      <MyToggle target={"ia"} style={"mt-10"}>
        Suivre recommandation
      </MyToggle>
    </>
  ),
};

export let _form_create_mission = [
  _form_create_mission_intro,
  _form_create_mission_info,
  _form_create_mission_blockchain,
  _form_create_mission_resume,
];
