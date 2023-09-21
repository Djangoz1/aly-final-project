export let fromTimestamp = (timestamp) => {
  // Créez une instance de Date à partir du timestamp
  var maDate = new Date(timestamp);

  // Obtenez les composants de la date
  var annee = maDate.getFullYear();
  var mois = maDate.getMonth() + 1; // Les mois sont indexés à partir de 0, donc ajoutez 1
  var jour = maDate.getDate();
  var heure = maDate.getHours();
  var minute = maDate.getMinutes();
  var seconde = maDate.getSeconds();

  // Formatez la date comme vous le souhaitez, par exemple au format "AAAA-MM-JJ HH:MM:SS"
  var dateFormatee =
    annee +
    "-" +
    (mois < 10 ? "0" : "") +
    mois +
    "-" +
    (jour < 10 ? "0" : "") +
    jour;

  return dateFormatee;
};
