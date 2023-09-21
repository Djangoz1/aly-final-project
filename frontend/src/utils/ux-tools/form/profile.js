import { MyCheckboxes } from "components/myComponents/myForm/MyCheckboxes";
import { MENUS_EDIT_PROFILE } from "constants/menus";

const { Icon } = require("@iconify/react");
const { MyFormInfo } = require("components/myComponents/myForm/MyFormInfo");
const { MyInputs } = require("components/myComponents/myForm/MyInputs");
const { MyInputsFile } = require("components/myComponents/myForm/MyInputsFile");
const { MySelects } = require("components/myComponents/myForm/MySelects");
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
    title: MENUS_EDIT_PROFILE[0],
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
    title: MENUS_EDIT_PROFILE[1],
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
    title: MENUS_EDIT_PROFILE[2],
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
    title: MENUS_EDIT_PROFILE[3],
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
