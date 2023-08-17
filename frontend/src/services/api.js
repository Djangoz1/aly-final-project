// src/services/api.js
import axios from 'axios';

const API_URL = 'http://16.16.143.39:8082';  // Assurez-vous d'utiliser http:// ou https:// selon votre configuration

export const extractJobDetails = async (description) => {
    console.log("Tentative d'extraction des détails avec la description:", description);

    try {
        const response = await axios.post(`${API_URL}/extract_specs/`, { desc: description });
        console.log("Réponse de l'API:", response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        throw error;
    }
};
