// components/JobDescriptionComponent.js
import axios from 'axios';

function JobDescriptionComponent() {
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState(null);

    const handleSubmit = () => {
        axios.post(`${13.49.138.244:8082}/extract_specs/`, { desc: description })
            .then(response => {
                setDetails(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    }

    return (
        <div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <button onClick={handleSubmit}>Extraire les détails</button>
            {/* Afficher les détails extraits ici */}
        </div>
    );
}

export default JobDescriptionComponent;

