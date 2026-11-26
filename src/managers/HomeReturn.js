// Retour arrière vers l'accueil : l'accueil ne rejoue pas son chargeur et rend la position de lecture.
// Valeurs gardées en mémoire le temps de la visite (navigation interne, pas de rechargement).
const HomeReturn = {
    loaded: false, // l'accueil a déjà fini de charger une fois
    scrollY: 0, // position de l'accueil au moment où on l'a quitté
};
export default HomeReturn
