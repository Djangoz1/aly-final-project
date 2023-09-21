import { MyCheckboxes } from "components/myComponents/myForm/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/myForm/MyFormInfo";
import { MyInputs } from "components/myComponents/myForm/MyInputs";
import { MySelects } from "components/myComponents/myForm/MySelects";
import { ENUMS_COURTS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import { MENUS_CREATE_FEATURE } from "constants/menus";

const { CVName } = require("components/inputs/inputsCV/CVName");
const { MyInputsFile } = require("components/myComponents/myForm/MyInputsFile");

export let _form_create_feature = ({ metadatas, datas, handleChange }) => {
  return [
    _form_create_feature_intro({ metadatas }),
    _form_create_feature_info({ metadatas, datas, handleChange }),
    _form_create_feature_blockchain({ metadatas, datas, handleChange }),
    _form_create_feature_resume({ metadatas, datas, handleChange }),
  ];
};

export let _form_create_feature_intro = ({
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

export let _form_create_feature_info = ({ metadatas, datas, handleChange }) => {
  let menu = MENUS_CREATE_FEATURE[1];

  return {
    title: `${menu.i} ${menu.title}`,

    description: (
      <>
        Attention ! Ces informations ne sont pas stockés dans la blockchain et
        n'ont pas d'incidence sur le protocole.
        <br />
        Elles n'ont qu'un but purement informatif afin d'attirer des
        freelancers.
      </>
    ),
    components: [
      <MyInputs
        inputs={[
          {
            label: "Titre",
            placeholder: "Intitulé de la feature",
          },
        ]}
      />,
      <MySelects
        styles={"my-4"}
        selects={[
          {
            label: "Domaine",
            target: "name",
            arr: DEV_DOMAIN,
            placeholder: "Quel domaine concerne la tâche ?",
          },
        ]}
      />,
      <MyInputsFile styles={"my-4"} inputs={[{ label: "Image" }]} />,

      <div className="my-4  flex flex-col">
        <label className="text-light font-light text-xs mb-1 uppercase ">
          Description
        </label>
        <textarea
          className="textarea font2 font-light textarea-bordered max-h-[30vh]"
          placeholder="Write your description ..."
        ></textarea>
      </div>,
    ],
  };
};

export let _form_create_feature_blockchain = ({
  metadatas,
  datas,
  handleChange,
}) => {
  let menu = MENUS_CREATE_FEATURE[2];

  return {
    title: `${menu.i} ${menu.title}`,

    description: (
      <>
        Attention toutes les informations suivantes auront une incidence sur le
        protocole. Veuillez bien vérifier toutes les données avant de confirmer
        afin d'éviter toutes erreurs
      </>
    ),
    components: [
      <MySelects
        styles={"mb-4"}
        selects={[
          {
            label: "Mission*",
            arr: [
              "Mission 1",
              "Mission 2",
              "Mission 3",
              "Mission 4",
              "Mission 5",
              "Mission 6",
            ],
            placeholder: "Pour quelle mission ?",
          },
          {
            label: "Specification *",
            target: "court",
            arr: ENUMS_COURTS,
            placeholder: "Quelle technologie est requise pour la tâche ?",
          },
        ]}
      />,
      <MyCheckboxes
        label={
          "Autorisez vous un freelancer à signer directement selon l'expérience ?"
        }
        checkboxes={[
          { title: "Non" },
          { title: "plus d'1 " },
          { title: "plus de 5 " },
          { title: "plus de 10 " },
          { title: "plus de 3 " },
        ]}
      />,
      <MyInputs
        inputs={[
          {
            label: "Salaire",
            placeholder: "0.3 eth",
          },
          {
            label: "Worker",
            placeholder: "Username du freelancer",
          },
          {
            label: "Temps estimé",
            placeholder: "10 jours",
          },
        ]}
        styles={"my-4"}
      />,
      <MyFormInfo
        title={
          <>
            <div className="text-white text-sm  flex items-center ">
              <input
                type="checkbox"
                className="toggle toggle-sm toggle-success mr-2"
                checked
              />
              Seulement sur invitation
            </div>
          </>
        }
        description={
          <>
            <br />
            <span className="text-white ">⚠️ Attention !</span>
            <p>
              <br />
              Souhaitez vous ouvrir les postulations pour ce poste
              <br />
              <br />
              <span className="text-white ">Si vous acceptez, </span>
              vous serez en capacité d'ouvrir ce poste à la candidature et vous
              pourez ensuite signé celui que vous souhaiterez.
              <br />
              <span className="text-white ">Si vous refusez, </span>
              vous ne pourrais pas recevoir les candidatures et vous devrez
              d'abord proposer ce poste à un freelancer qui choisiras d'accepter
              ou non .
              <br />
              <br />
              Veuillez choisir correctement la
              <span className="text-white "> spécification </span>
              car celle-ci seras déterminante en cas de
              <span className="text-white "> litiges</span>.
              <br />
              <br />
              En cas de litige, le protocole enverras le dossier directement à
              la
              <span className="text-white "> court lié à la spécification</span>
              .
              <br />
              La court est composé de jurys qui ont de l'expérience sur cette
              spécification.
            </p>
          </>
        }
      />,
    ],
  };
};

export let _form_create_feature_resume = ({
  metadatas,
  datas,
  handleChange,
}) => {
  let menu = MENUS_CREATE_FEATURE[MENUS_CREATE_FEATURE.length - 1];
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
