import { MyToggle } from "components/myComponents/form/MyToggle";
import { MENUS } from "constants/menus";
let menu = {
  edit: [
    { i: "👤", title: "Information personnelle" },
    { i: "🫂", title: "Social" },
    { i: "👨‍💻", title: "Work" },
    { i: "🔌", title: "Blockchain" },
  ],
  create: [
    { i: "ℹ️", title: "Introduction" },
    { i: "🗂️", title: "Information personnelle" },
    { i: "👨‍💻", title: "Work" },
  ],
};
export let _form_edit_profile_information = {
  title: `${menu.edit[0].i} ${menu.edit[0].title}`,
  description: (
    <>
      Les informations pour votre compte n'ont aucune incidence sur le protocole
      deWork.
      <br />
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_social = {
  title: `${menu.edit[1].i} ${menu.edit[1].title}`,
  description: (
    <>
      Les informations suivante n'ont aucune incidence sur le protocole deWork.
      <br />
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_work = {
  title: `${menu.edit[2].i} ${menu.edit[2].title}`,
  description: (
    <>
      Les informations pour votre compte n'ont aucune incidence sur le protocole
      deWork.
      <br />
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_blockchain = {
  title: `${menu.edit[3].i} ${menu.edit[3].title}`,
  description: (
    <>
      Pour ce qui concerne votre compte, seul votre addresse est stocké sur la
      blockchain.
      <br />
      <br />
      Nous vous conseillons de ne changer l'addresse qu'en cas de faiblesse sur
      votre addresse actuel. Une fois fait, toute vos actions devras être faites
      sur la nouvelle addresse et les salaires seront versés à cette nouvelle
      addresse.
    </>
  ),
};

export let _form_edit_profile = [
  _form_edit_profile_information,
  _form_edit_profile_social,
  _form_edit_profile_work,
  _form_edit_profile_blockchain,
];

// ********** ------ ********** //
// ********** Create ********** //
// ********** ------ ********** //

export let _form_create_profile_intro = {
  title: <>Welcome ! 👋</>,

  info: "Vous voulez créer un nouveau profile",
  description: (
    <>
      Je m'appelle Aly je suis votre ami virtuel qui vous accompagnera tout au
      long du processus de recherche et de création de mission pour trouver le
      freelance parfait. Mon objectif est de rendre cette expérience aussi
      fluide et agréable que possible pour vous.
      <br />
      <br />
      <span className="c1 font-bold">👥 Recherche de freelances :</span>
      <br />
      Je vous orienterai vers les plateformes de freelance populaires où vous
      pourrez trouver des talents correspondant à vos besoins spécifiques.
      <br />
      <br />
      <span className="c1 font-bold">
        📧 Communication avec les freelances :
      </span>
      Je vous donnerai des conseils sur la communication efficace avec les
      freelances, y compris les questions à poser lors de l'entretien et les
      étapes à suivre pour conclure un contrat.
      <br />
      <br />
      <span className="c1 font-bold">🔒 Sécurité et confidentialité :</span>
      <br />
      Vos informations sont en sécurité avec moi. Je prends la confidentialité
      au sérieux et ne partagerai aucune donnée personnelle.
      <br />
      <br />
      <span className="c1 font-bold">💬 Support continu :</span>
      <br />
      Je suis disponible 24/7 pour répondre à vos questions et vous aider à
      résoudre tout problème qui pourrait survenir lors de votre recherche de
      freelance. N'hésitez pas à me poser des questions ou à demander de l'aide
      à tout moment. Je suis là pour vous guider dans votre quête du freelance
      idéal.
      <br />
      <br />
      <span className="c1 font-bold">
        <br />
        Je te laise commencer et je reviendrais vers toi avant que tu ne
        confirme 😄
      </span>
    </>
  ),
};

export let _form_create_profile_info = {
  title: `${menu.create[1].i} ${menu.create[1].title}`,
  description: (
    <>
      Veuillez compléter les informations suivantes pour une meilleur
      expérience. <br />
      expérience. <br />
      Ces informations sont réunis dans un but purement informatif et ne seront
      pas stocké dans la blockchain et n'auras aucune incidence sur le
      protocole.
    </>
  ),
};

export let _form_create_profile_work = {
  title: `${menu.create[2].i} ${menu.create[2].title}`,

  description: (
    <>
      <h6 className="text-lg font-bold c1">👁️ Visibilité</h6>
      <br />
      En anonymisant votre profil, votre CV sera visible en CVthèque mais sans
      votre nom, prénom, numéro de téléphone et adresse e-mail.
      <br />
      <br />
      Pensez à bien supprimer ces données également de votre fichier CV. En
      revanche , lorsque vous postulerez, vos données personnelles deviendront
      visibles par les recruteurs.
      <br />
      <br />
      Vous pourrez le modifier à tout moment.
      <MyToggle style={"mt-4"} target={"visibility"}>
        Anonymiser mon profil
      </MyToggle>
    </>
  ),
};

export let _form_create_profile = [
  _form_create_profile_intro,
  _form_create_profile_info,
  _form_create_profile_work,
];
