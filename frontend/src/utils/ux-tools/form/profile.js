import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import { MENUS } from "constants/menus";

const { Icon } = require("@iconify/react");
const { MyFormInfo } = require("components/myComponents/form/MyFormInfo");
const { MyInputs } = require("components/myComponents/form/MyInputs");
const { MyInputsFile } = require("components/myComponents/form/MyInputsFile");
const { MySelects } = require("components/myComponents/form/MySelects");
const { icfyFB, icfyLINKEDIN, icfyGITHUB2, icfyTWITTER } = require("icones");

export let _form_edit_profile = ({ metadatas, handleChange }) => {
  return [
    _form_edit_profile_information({ handleChange, metadatas }),
    _form_edit_profile_social({ handleChange, metadatas }),
    _form_edit_profile_work({ handleChange, metadatas }),
    _form_edit_profile_blockchain({ handleChange, metadatas }),
  ];
};

export let _form_edit_profile_information = ({ handleChange, metadatas }) => {
  return {
    title: MENUS.profile.edit[0],
    components: [
      <MyInputs
        inputs={[
          { label: "Username", placeholder: metadatas?.username || "Vitalik" },
          {
            label: "Téléphone",
            placeholder:
              metadatas?.attributes[0]?.identity?.phone || "07 01 90 20 08",
          },
        ]}
        styles={"mb-1"}
      />,
      <MyInputsFile
        styles={"my-2"}
        inputs={[{ label: "Photo de profil" }, { label: "Bannière" }]}
      />,
    ],
    description: (
      <>
        Les informations pour votre compte n'ont aucune incidence sur le
        protocole deWork.
        <br />
        Veuillez remplir le maximum d'information afin d'attirer le maximums de
        recruteurs.
      </>
    ),
  };
};

export let _form_edit_profile_social = ({ handleChange, metadatas }) => {
  return {
    title: MENUS.profile.edit[1],
    components: [
      <MyInputs
        // styles="flex-col"
        inputs={[
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyFB} /> Facebook
              </span>
            ),
            placeholder: "URL https://facebook...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyLINKEDIN} /> Linkedin
              </span>
            ),
            placeholder: "URL https://linkedin...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyGITHUB2} /> Github
              </span>
            ),
            placeholder: "URL https://github...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyTWITTER} /> Twitter
              </span>
            ),
            placeholder: "URL https://twitter...",
          },
        ]}
      />,
    ],
    description: (
      <>
        Les informations suivante n'ont aucune incidence sur le protocole
        deWork.
        <br />
        Veuillez remplir le maximum d'information afin d'attirer le maximums de
        recruteurs.
      </>
    ),
  };
};

export let _form_edit_profile_work = ({ handleChange, metadatas }) => {
  return {
    title: MENUS.profile.edit[2],
    components: [
      <MyCheckboxes
        label={"Quel type de mission recherchez-vous ?"}
        checkboxes={[
          { title: "- d'1 semaine" },
          { title: "- de 4 semaines" },
          { title: "+ de 4 semaines" },
          { title: "+ de 3 mois" },
          { title: "Ouvert" },
        ]}
      />,
      <MyFormInfo
        title={
          <>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary "
              checked={metadatas?.attributes[0]?.visibility}
              onChange={() =>
                handleChange({
                  target: "visibility",
                  value: !metadatas?.attributes[0]?.visibility,
                })
              }
            />
            <span className="text-xs  w-fit ml-4">
              Visibilité de mon profil
            </span>
          </>
        }
        description={
          <>
            En activant la visibilité de votre profil, votre CV sera visible par
            les recruteurs sur la plateforme. En revanche la visibilité de votre
            profil depuis la blockchain n'est elle pas modifiable
            <br />
            <br />
            Vous pourrez le modifier à tout moment.
          </>
        }
      />,
      <MySelects
        selects={[
          {
            label: "Langues",
            arr: ["Français", "Espagnol", "Italien", "Allemand", "Anglais"],
            placeholder: "Quelle langue maitrisez-vous ?",
          },
          {
            label: "Niveau",
            arr: ["Notions", "Courant", "Professionnel", "Langue maternelle"],
            placeholder: "Choisir",
          },
        ]}
      />,

      <MyInputsFile styles={"my-4"} inputs={[{ label: "CV" }]} />,
    ],
    description: (
      <>
        Les informations pour votre compte n'ont aucune incidence sur le
        protocole deWork.
        <br />
        Veuillez remplir le maximum d'information afin d'attirer le maximums de
        recruteurs.
      </>
    ),
  };
};

export let _form_edit_profile_blockchain = ({ handleChange, metadatas }) => {
  return {
    title: MENUS.profile.edit[3],
    components: [
      <MyInputs
        styles="flex-col"
        inputs={[
          {
            label: <>Account address</>,
            placeholder: "0xfea2...",
          },
        ]}
      />,
    ],
    description: (
      <>
        Pour ce qui concerne votre compte, seul votre addresse est stocké sur la
        blockchain.
        <br />
        Nous vous conseillons de ne changer l'addresse qu'en cas de faiblesse
        sur votre addresse actuel. Une fois fait, toute vos actions devras être
        faites sur la nouvelle addresse et les salaires seront versés à cette
        nouvelle addresse.
      </>
    ),
  };
};

export let _form_create_profile = ({ datas, handleChange }) => {
  return [
    _form_create_profile_intro,
    _form_create_profile_info({ datas, handleChange }),
    _form_create_profile_work({ datas, handleChange }),
    _form_create_profile_social({ datas, handleChange }),
  ];
};

export let _form_create_profile_intro = {
  title: <>Welcome ! 👋</>,
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
    </>
  ),
};

export let _form_create_profile_info = ({ datas, handleChange }) => {
  let menu = MENUS.profile.create[1];
  return {
    title: `${menu.i} ${menu.title}`,
    description: (
      <>
        Veuillez compléter les informations suivantes pour une meilleur
        expérience. <br />
        Ces informations sont réunis dans un but purement informatif et ne
        seront pas stocké dans la blockchain et n'auras aucune incidence sur le
        protocole.
      </>
    ),
    components: [
      <MyCheckboxes
        label={"Civilité"}
        checkboxes={[{ title: "M." }, { title: "Mme." }]}
      />,
      <MyInputs
        inputs={[
          {
            label: "Prénom",
            placeholder: "John",
          },
          {
            label: "Nom",
            placeholder: "Doe",
          },
        ]}
      />,
      <MyInputs
        inputs={[
          {
            label: "Téléphone",
            placeholder: "07 01 10 20 02",
          },
          {
            label: "Date de naissance",
            placeholder: "jj/mm/aaaa",
          },
        ]}
      />,
      <MyTextArea label={"Bio"} placeholder={"Write your bio ..."} />,
    ],
  };
};

export let _form_create_profile_work = ({ datas, handleChange }) => {
  let menu = MENUS.profile.create[2];
  return {
    title: `${menu.i} ${menu.title}`,
    description: (
      <>
        En anonymisant votre profil, votre CV sera visible en CVthèque mais sans
        votre nom, prénom, numéro de téléphone et adresse e-mail. Pensez à bien
        supprimer ces données également de votre fichier CV. En revanche ,
        lorsque vous postulerez, vos données personnelles deviendront visibles
        par les recruteurs.
        <br />
        <br />
        Vous pourrez le modifier à tout moment.
        <div className="flex items-center mt-4 text-white">
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary "
            checked
          />
          <span className="text-xs  w-fit ml-4">Anonymiser mon profil</span>
        </div>
      </>
    ),
    components: [
      <div className="flex flex-col ">
        <MyInputsFile inputs={[{ label: "CV" }]} />

        <p className="text-light text-white font-light text-xs mb-1 ">
          Vous pouvez renseigner votre CV hors plateforme afin qu'il soit vu par
          les recruteurs.
        </p>
      </div>,
      <MyCheckboxes
        label={"Quel type de mission recherchez-vous ?"}
        checkboxes={[
          { title: "- d'1 semaine" },
          { title: "- de 4 semaines" },
          { title: "+ de 4 semaines" },
          { title: "+ de 3 mois" },
          { title: "Ouvert" },
        ]}
      />,
      <MySelects
        selects={[
          {
            label: "Métiers recherchés",
            target: "name",
            arr: DEV_DOMAIN,
            placeholder: "Quel domaine recherchez vous ?",
          },
          {
            label: "Compétences",
            target: "court",
            arr: ENUMS.courts,
            placeholder: "Quelles technologies maitrisez-vous ?",
          },
        ]}
      />,
      <MySelects
        selects={[
          {
            label: "Langues",
            arr: ["Français", "Espagnol", "Italien", "Allemand", "Anglais"],
            placeholder: "Quelle langue maitrisez-vous ?",
          },
          {
            label: "Niveau",
            arr: ["Notions", "Courant", "Professionnel", "Langue maternelle"],
            placeholder: "Choisir",
          },
        ]}
      />,
    ],
  };
};
export let _form_create_profile_social = ({ datas, handleChange }) => {
  let menu = MENUS.profile.create[2];
  return {
    title: `${menu.i} ${menu.title}`,
    description: (
      <>
        En anonymisant votre profil, votre CV sera visible en CVthèque mais sans
        votre nom, prénom, numéro de téléphone et adresse e-mail. Pensez à bien
        supprimer ces données également de votre fichier CV. En revanche ,
        lorsque vous postulerez, vos données personnelles deviendront visibles
        par les recruteurs.
        <br />
        <br />
        Vous pourrez le modifier à tout moment.
      </>
    ),
    components: [
      <MyInputs
        inputs={[
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyFB} /> Facebook
              </span>
            ),
            placeholder: "URL https://facebook...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyLINKEDIN} /> Linkedin
              </span>
            ),
            placeholder: "URL https://linkedin...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyGITHUB2} /> Github
              </span>
            ),
            placeholder: "URL https://github...",
          },
          {
            label: (
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyTWITTER} /> Twitter
              </span>
            ),
            placeholder: "URL https://twitter...",
          },
        ]}
      />,
    ],
  };
};
