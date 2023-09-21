import React from "react";
import { MyModal } from "../MyModal";
import { Icon } from "@iconify/react";
import { icfyCV } from "icones";
import { MyCheckboxes } from "components/myComponents/myForm/MyCheckboxes";
import { ListDevDomains } from "components/inputs/inputsMission/Description/list";
import { DEV_DOMAIN } from "constants/languages";
import { ENUMS_COURTS } from "constants/enums";
import { MyInputs } from "components/myComponents/myForm/MyInputs";
import { MySelects } from "components/myComponents/myForm/MySelects";
import { MyFormInfo } from "components/myComponents/myForm/MyFormInfo";

export const CreateProfile = () => {
  return (
    <MyModal
      btn={"Create profile"}
      styles={{ modal: "w-[70vw]" }}
      modal={
        <div className="flex ">
          <ul className="steps steps-vertical min-w-fit mr-12">
            <li data-content="👤" className="step step-primary">
              Information personnelle
            </li>
            <li data-content="🪪" className="step step-primary">
              Déposez votre CV
            </li>
            <li data-content="👨‍💻" className="step">
              Recherche de poste
            </li>
            <li data-content="🎓" className="step">
              Formation
            </li>
            <li data-content="🔌" className="step">
              Compétences
            </li>
            <li data-content="👁️" className="step">
              Votre visibilité
            </li>
            <li data-content="🫂" className="step">
              Réseaux social
            </li>
          </ul>
          <div className="">
            <MyFormInfo
              title={<h6 className="text-2xl">Bienvenue ! 👋</h6>}
              description={
                <>
                  Veuillez compléter les informations suivantes pour une
                  meilleur expérience. <br />
                  Ces informations sont réunis dans un but purement informatif
                  et ne seront pas stocké dans la blockchain et n'auras aucune
                  incidence sur le protocole.
                </>
              }
            />

            <form className="flex flex-col mt-5">
              <MyCheckboxes
                label={"Civilité"}
                checkboxes={[{ title: "M." }, { title: "Mme." }]}
              />
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
                styles={"my-4"}
              />
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
                styles={"my-4"}
              />

              <div className="flex flex-col my-2">
                <label className="text-light font-light text-xs mb-1 uppercase ">
                  CV
                </label>
                <p className="text-light text-white font-light text-xs mb-1 ">
                  Vous pouvez renseigner votre CV hors plateforme afin qu'il
                  soit vu par les recruteurs.
                </p>

                <input
                  type="file"
                  className="file-input file-input-xs file-input-bordered w-fit"
                />
              </div>

              <MyFormInfo
                title={
                  <>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary "
                      checked
                    />
                    <span className="text-xs  w-fit ml-4">
                      Anonymiser mon profil
                    </span>
                  </>
                }
                description={
                  <>
                    En anonymisant votre profil, votre CV sera visible en
                    CVthèque mais sans votre nom, prénom, numéro de téléphone et
                    adresse e-mail. Pensez à bien supprimer ces données
                    également de votre fichier CV. En revanche , lorsque vous
                    postulerez, vos données personnelles deviendront visibles
                    par les recruteurs.
                    <br />
                    <br />
                    Vous pourrez le modifier à tout moment.
                  </>
                }
              />
              <MyCheckboxes
                label={"Quel type de mission recherchez-vous ?"}
                checkboxes={[
                  { title: "- d'1 semaine" },
                  { title: "- de 4 semaines" },
                  { title: "+ de 4 semaines" },
                  { title: "+ de 3 mois" },
                  { title: "Ouvert" },
                ]}
              />

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
                    arr: ENUMS_COURTS,
                    placeholder: "Quelles technologies maitrisez-vous ?",
                  },
                ]}
                styles={"my-4"}
              />
              <MySelects
                selects={[
                  {
                    label: "Langues",
                    arr: [
                      "Français",
                      "Espagnol",
                      "Italien",
                      "Allemand",
                      "Anglais",
                    ],
                    placeholder: "Quelle langue maitrisez-vous ?",
                  },
                  {
                    label: "Niveau",
                    arr: [
                      "Notions",
                      "Courant",
                      "Professionnel",
                      "Langue maternelle",
                    ],
                    placeholder: "Choisir",
                  },
                ]}
              />

              <MyInputs
                inputs={[
                  {
                    label: "Facebook",
                    placeholder: "URL https://facebook...",
                  },
                  {
                    label: "Linkedin",
                    placeholder: "URL https://linkedin...",
                  },
                  {
                    label: "Github",
                    placeholder: "URL https://github...",
                  },
                  {
                    label: "Twitter",
                    placeholder: "URL https://twitter...",
                  },
                ]}
                styles={"my-4"}
              />
              <button className=" my-4 ml-auto btn btn-success btn-xs">
                Créer CV
              </button>
            </form>
          </div>
        </div>
      }
    />
  );
};
