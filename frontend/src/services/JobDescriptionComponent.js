// components/JobDescriptionComponent.js
'use client';

import { useState } from 'react';
import { extractJobDetails } from '../services/api';  // Assurez-vous que le chemin est correct


const detailBoxStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    margin: '12px',
};

const textAreaStyle = {
    width: '60%',
    margin: '20px',
};

function JobDescriptionComponent() {

    const [description, setDescription] = useState('');
    const [details, setDetails] = useState(null);

    const handleSubmit = async () => {
        console.log("Bouton cliqué !");
        // ... reste du code

        try {
            const extractedDetails = await extractJobDetails(description);
            setDetails(extractedDetails);
        } catch (error) {
            console.error("Erreur lors de l'extraction des détails:", error);
        }
    };

    return (
        <div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={textAreaStyle}></textarea>
            <button onClick={handleSubmit} className='btn btn-xs btn-primary'>Extraire les détails</button>
            {/* Afficher les détails extraits ici */}
            {details && (
                <div>
                    {Object.entries(details).map(([key, value]) => (
                        <div key={key} style={detailBoxStyle}>
                            <strong>{key}:</strong> {value}
                        </div>
                    ))}
                </div>

                        
            )}
        </div>
    );
}

export default JobDescriptionComponent;
