import { MENUS } from "constants/menus";

export let _form_edit_profile_information = {
  title: `${MENUS.profile.edit[0].i} ${MENUS.profile.edit[0].title}`,
  description: (
    <>
      Les informations pour votre compte n'ont aucune incidence sur le protocole
      deWork.
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_social = {
  title: `${MENUS.profile.edit[1].i} ${MENUS.profile.edit[1].title}`,
  description: (
    <>
      Les informations suivante n'ont aucune incidence sur le protocole deWork.
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_work = {
  title: `${MENUS.profile.edit[2].i} ${MENUS.profile.edit[2].title}`,
  description: (
    <>
      Les informations pour votre compte n'ont aucune incidence sur le protocole
      deWork.
      <br />
      Veuillez remplir le maximum d'information afin d'attirer le maximums de
      recruteurs.
    </>
  ),
};

export let _form_edit_profile_blockchain = {
  title: `${MENUS.profile.edit[3].i} ${MENUS.profile.edit[3].title}`,
  description: (
    <>
      Pour ce qui concerne votre compte, seul votre addresse est stocké sur la
      blockchain.
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

export let _form_create_profile_info = {
  title: `${MENUS.profile.create[1].i} ${MENUS.profile.create[1].title}`,
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

export let _form_create_profile_work = {
  title: `${MENUS.profile.create[2].i} ${MENUS.profile.create[2].title}`,

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

export let _form_create_profile = [
  _form_create_profile_intro,
  _form_create_profile_info,
  _form_create_profile_work,
];
