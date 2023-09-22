import { CVName } from "components/inputs/inputsCV/CVName";
import { MyInputs } from "components/myComponents/form/MyInputs";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { DEV_DOMAIN } from "constants/languages";
import { MENUS_CREATE_MISSION } from "constants/menus";

export let _form_create_mission = ({ metadatas, datas, handleChange }) => {
  return [
    _form_create_mission_intro({ metadatas }),
    _form_create_mission_info({ metadatas }),
    _form_create_mission_blockchain({ metadatas }),
    _form_create_mission_resume({ metadatas }),
  ];
};

export let _form_create_mission_intro = ({
  metadatas,
  datas,
  handleChange,
}) => {
  return {
    title: (
      <>
        Salut <CVName metadata={metadatas} /> ! 👋
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
        Je vais vous poser quelques questions clés pour comprendre vos besoins,
        et en fonction de vos réponses, je vous aiderai à rédiger une
        description de mission claire et concise.
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
        <span className="text-white">
          📧 Communication avec les freelances :
        </span>
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
        freelance. N'hésitez pas à me poser des questions ou à demander de
        l'aide à tout moment. Je suis là pour vous guider dans votre quête du
        freelance idéal.
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
};

export let _form_create_mission_info = ({ metadatas, datas, handleChange }) => {
  let menu = MENUS_CREATE_MISSION[1];
  return {
    title: `${menu.i} ${menu.title}`,

    description: (
      <>
        ⚠️ Attention !
        <br />
        <br />
        Aucune de ces informations n'ont une incidence sur le protocole. Elles
        ne servent qu'à un but purement informative.
      </>
    ),
    components: [
      <MyInputs
        inputs={[
          {
            label: "Titre",
            placeholder: "Intitulé de la mission",
          },
        ]}
      />,
      <MySelects
        selects={[
          {
            label: "Domaine",
            target: "name",
            arr: DEV_DOMAIN,
            placeholder: "Quel domaine concerne la mission ?",
          },
        ]}
      />,
      <MyInputsFile inputs={[{ label: "Image" }, { label: "Bannière" }]} />,
      <div className="flex hover:text-white flex-col">
        <label className="text-light font-light text-xs mb-1 uppercase ">
          Description
        </label>
        <textarea
          className="textarea font2 font-light  textarea-bordered  max-h-[25vh] h-[25vh]"
          placeholder="Write your description ..."
        ></textarea>
      </div>,
    ],
  };
};

export let _form_create_mission_blockchain = ({
  metadatas,
  datas,
  handleChange,
}) => {
  let menu = MENUS_CREATE_MISSION[2];
  return {
    title: `${menu.i} ${menu.title}`,

    description: (
      <>
        Je suis disponible 24/7 pour répondre à vos questions et vous aider à
        résoudre tout problème qui pourrait survenir lors de votre recherche de
        freelance. N'hésitez pas à me poser des questions ou à demander de
        l'aide à tout moment. Je suis là pour vous guider dans votre quête du
        freelance idéal.
      </>
    ),
    components: [
      <MySelects
        selects={[
          {
            label: "Mission Ref*",
            arr: [
              "Mission 1",
              "Mission 2",
              "Mission 3",
              "Mission 4",
              "Mission 5",
              "Mission 6",
            ],
            placeholder: "Liaison à une ancienne mission",
          },
          {
            label: "Launchpad*",
            arr: [
              "Launchpad 1",
              "Launchpad 2",
              "Launchpad 3",
              "Launchpad 4",
              "Launchpad 5",
              "Launchpad 6",
            ],
            placeholder: "Est-elle financé par un launchpad ?",
          },
        ]}
      />,
    ],
  };
};

export let _form_create_mission_resume = ({
  metadatas,
  datas,
  handleChange,
}) => {
  let menu = MENUS_CREATE_MISSION[MENUS_CREATE_MISSION.length - 1];
  return {
    title: `${menu.i} ${menu.title}`,
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
          Tu estimes à<span className="text-white ml-1"> 10 jours </span> le
          temps de conception.
          <br />
          <br />
          Tu payes
          <span className="text-white ml-1"> 0.3 ETH </span> pour la livraison
          de cette feature. Tu payes:
          <span className="text-white ml-1">Javascript</span>.
          <br />
          <br />
          Je vais vous poser quelques questions clés pour comprendre vos
          besoins, et en fonction de vos réponses, je vous aiderai à rédiger une
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
};
