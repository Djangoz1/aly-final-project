let fuzzing = {
  accounts: [
    { username: "DAW CEO", avatar: "avatar1.avif" },
    { username: "Django", avatar: "avatar2.jpeg" },
    { username: "Theo", avatar: "avatar3.avif" },
    { username: "Valentin", avatar: "avatar4.avif" },
    { username: "DAW Manager" },
    { username: "DAW Economist", avatar: "profile.jpeg" },
    { username: "Testor3" },
    { username: "Testor4" },
  ],
  missions: [
    {
      title: "DEWORK - DECENTRALIZED FREELANCE PLATFORM",
      domain: 3,
      abstract:
        "Creating a decentralized application for freelancing services, with various blockchain components and a frontend in Next.js, backend in Golang.",
      description: `The mission consists of creating DeWork, a decentralized application (dApp) for freelancing services with a backend in Golang and frontend in Next.js.
    The blockchain component of the project involves the development of smart contracts for:
    Freelancing - agreements between project owners and freelancers.
    Escrow - a court of freelancers to adjudicate disputes, with random arbitrator selection.
    Launchpad - crowdfunding platform for projects with funds restricted to freelance contract use.
    Monetized content (pubs) - users can sell scripts, SaaS, templates, etc., with royalty deductions.
    Challenges - companies post challenges, freelancers attempt solutions, and arbitrators award up to 3 winners from a prize pool.
    ERC20 Governance Token - create a governance token based on the ERC20 protocol including the governance system and tokenomics.
    ERC721URIStorage - use ERC721URIStorage protocol to store non-essential blockchain data off-chain to reduce gas costs.
    `,
      gallery: [
        "cvs.png",
        "escrows.png",
        "launchpads.png",
        "missions.png",
        "pubs.png",
      ],
      features: [
        {
          title: "👩‍💻 Frontend Developer",
          abstract:
            "The mission is to create a user interface for a freelance decentralized application (dApp) with integration to blockchain technology, to be built using Next.js. The client is seeking advice on best practices for optimization.",
          description:
            "A front-end developer with a focus on Next.js is needed to build the UI, ensure it's responsive and optimized for performance, and integrate it with blockchain. The task is to develop the user interface for a freelance decentralized application (dApp) that integrates with blockchain technology. The UI should be built using Next.js, a React framework, to ensure high performance and server-side rendering capabilities. Is requesting guidance on best practices to optimize the development process to create an efficient and scalable user interface.",
          specification: 5,
          domain: 1,
          skills: [
            "Next.js",
            "React",
            "JavaScript",
            "CSS",
            "Web3.js",
            "Blockchain Integration",
            "Responsive Design",
            "Performance Optimization",
          ],
          toDo: [
            {
              description: "Créer le premier repo",
              link: "https://github.com/Djangoz1/aly-final-project/tree/main/frontend",
              workflow: 2,
            },
            {
              description: "Faire une landing page",
              link: "https://github.com/Djangoz1/aly-final-project/blob/main/frontend/src/app/page.js",
              workflow: 1,
            },
            {
              description:
                "Déployer la bêta sur fly.io || Vercel || propre serveur",
              workflow: 0,
            },
            {
              description: "Lancer le site web",
              workflow: 0,
            },
            {
              description: "Nettoyer le code",
              workflow: 1,
            },
            {
              description: "Faire les messages d'alerte",
              workflow: 0,
            },
            {
              description: "Gérer le workflow d'un formulaire",
              workflow: 1,
            },
            {
              description: "Sécuriser un formulaire",
              workflow: 1,
            },
            {
              description: "Gérer le searching",
              workflow: 0,
            },
            {
              description: "Faire la page de messages et la messagerie",
              workflow: 1,
            },
            {
              description: "Faire la page des repos",
              workflow: 0,
            },
            {
              description: "Faire la page de la gallery",
              workflow: 1,
            },
            {
              description: "Faire la page de la gallery",
              workflow: 1,
            },
            {
              description: "Faire un éditeur de code pour le pub content",
              workflow: 0,
            },

            {
              description: "Faire la marketplace",
              workflow: 0,
            },
          ],
        },
        {
          account: 2,
          title: "👨‍💻 Backend Developer",

          description:
            "As the expert responsible for crafting the server logic, database schema, and smart contracts, this role is crucial to building a sound and reliable backend system for the dApp. The core objective of the mission is to develop a robust backend for a freelance dApp which includes building server-side logic, designing and implementing a database schema, as well as ensuring secure and efficient smart contract interactions. The technology stack must include Golang for backend development, and the implementation should follow industry standard best practices to ensure a scalable and secure application.",
          abstract:
            "The mission is to develop a freelance decentralized application (dApp) focusing on server-side logic, database schema, and smart contract interactions using Golang and adhering to best practices.",
          specification: 12,
          domain: 2,
          skills: [
            "Golang",
            "API Development",
            "Database Management",
            "Security",
            "Scalability Best Practices",
          ],
          toDo: [
            {
              description: "Créer le premier repo",
              link: "https://github.com/Djangoz1/aly-final-project/tree/main/backend",
              workflow: 2,
            },
            {
              description:
                "Déployer la base de données sur Fly.io || Vercel || propre serveur",
              workflow: 0,
            },
            {
              description: "Déployer l'app sur AWS",
              workflow: 0,
            },
            {
              description: "Migrer de pinata à pocketbase",
              workflow: 2,
            },
            {
              description:
                "Migrer de pocketbase à notre propre base de données",
              workflow: 0,
            },
            {
              description: "Nettoyer le code",
              workflow: 1,
            },
            {
              description: "Créer une API",
              workflow: 0,
            },
            {
              description: "Sécuriser l'API",
              workflow: 0,
            },
            {
              description: "Sécuriser le système de messagerie",
              workflow: 0,
            },
          ],
        },
        {
          account: 1,
          title: "🔗 Blockchain Developer",
          abstract:
            "Creating a decentralized application for freelancing services, with various blockchain components and a frontend in Next.js, backend in Golang.",
          description:
            "To design, develop, and integrate smart contracts for freelancing, escrow, launchpad, monetized content, challenges, and governance token. To ensure each module's secure and efficient operation within the DeWork platform. The mission involves the creation of DeWork, a decentralized application (dApp) providing a freelancing platform. The backend will be programmed in Golang and the frontend in Next.js. The blockchain features include smart contracts for freelancing agreements, an escrow system with an arbitration mechanism, a crowdfunding launchpad, a marketplace for monetized content, a challenge system for companies and freelancers, an ERC20 governance token, and implementation of the ERC721URIStorage protocol.",
          specification: 2,
          skills: [
            "Solidity",
            "Ether.js or web3.js",
            "Smart Contract Development",
            "ERC20",
            "ERC721/ERC721URIStorage",
            "Blockchain Integration",
            "Smart Contract Testing & Audit",
            "Decentralized Application Architecture",
          ],
          domain: 4,
          toDo: [
            {
              description: "Créer le premier repo",
              link: "https://github.com/Djangoz1/aly-final-project/tree/main/backend/contracts",
              workflow: 2,
            },
            {
              description: "Déployer les contrats sur le test net",
              workflow: 0,
            },
            {
              description: "Déployer les contrats sur le mainnet",
              workflow: 0,
            },

            {
              description: "Faire le protocole freelancing",
              workflow: 2,
            },
            {
              description: "Faire le protocole challenge",
              workflow: 1,
            },
            {
              description:
                "Faire communiquer les contrats  challenges et les contrats arbitrators",
              workflow: 0,
            },
            {
              description: "Ajouter les fonctions : 'createFeatureWithWorker' ",
              workflow: 1,
            },
            {
              description: "Créer le workflow des missions de la DAO",
              workflow: 1,
            },
            {
              description: "Gérer le workflow pour coller à la roadmap",
              workflow: 0,
            },
            {
              description: "Faire le protocole escrow",
              workflow: 2,
            },
            {
              description: "Faire le protocole launchpad",
              workflow: 2,
            },
            {
              description: "Faire le protocole pubs",
              workflow: 1,
            },
            {
              description: "Faire le contrat accessControl",
              workflow: 0,
            },
            {
              description: "Faire le contrat royalties",
              workflow: 0,
            },
            {
              description: "Faire tout les tests",
              workflow: 1,
            },

            {
              description: "Nettoyer le code",
              workflow: 1,
            },
          ],
        },
        {
          account: 1,
          title: "👨‍🎨 UX/UI Designer",

          abstract:
            "Development of a DeWork decentralized application for freelancing services that features a Golang backend, a Next.js frontend, and multiple blockchain-based.",
          description: `Required to develop a user-friendly and aesthetically modern frontend for the dApp, and to ensure React best practices are implemented for performance and scalability. The mission involves the creation of DeWork, a decentralized application (dApp) focused on freelancing services. The technical stack includes a backend in Golang and frontend in Next.js.
            The blockchain portion entails several components:
                * 		Smart contracts for freelancing agreements.
                * 		A system for escrow involving a court of freelancers for dispute arbitration with random selection.
                * 		A launchpad for crowdfunded projects requiring use of freelance services.
                * 		A marketplace for monetized content including scripts, SaaS, templates, etc.
                * 		Provision for companies to post challenges with freelancers competing and arbitrators rewarding winners.
                * 		Creation of an ERC20 governance token with a bespoke governance system and tokenomics.
                * 		Implementation of the ERC721URIStorage protocol for off-chain storage to optimize gas costs.`,
          skills: [
            "Three.js",
            "Framer",
            "Design (UI/UX)",
            "HTML",
            "CSS",
            "Figma",
          ],

          specification: 4,
          domain: 7,
          toDo: [
            {
              description: "Améliorer l'UX",
              workflow: 0,
            },
            {
              description: "Améliorer l'UI",
              workflow: 0,
            },
            {
              description: "Faire du three.js",
              workflow: 1,
            },
          ],
        },
        {
          account: 4,
          title: "🔍 Quality Assurance Engineer",
          abstract:
            "Hire a developer with Go language expertise for backend development on DeWork, a decentralized freelance platform.",
          description: `The Developer role is required to scrutinize the dApp's codebase, write secure and efficient backend code, automate testing processes, and ensure the overall performance and security align with the decentralized nature of DeWork. The mission entails testing and ensuring both functionality and security of the decentralized application (dApp) associated with DeWork. 
            Detailed tasks involve conducting thorough security audits, implementing automated tests, and optimizing the backend code for performance and reliability using Go programming language expertise. `,
          specification: 3,
          skills: [
            "Go programming",
            "Backend development",
            "Automated testing",
            "Security auditing",
            "Performance optimization",
            "Blockchain knowledge",
          ],
          domain: 4,
          toDo: [
            {
              description:
                "Se renseigner auprès d'un avocat sur ce qui est possible de faire",
              workflow: 0,
            },
            {
              description: "Gérer le RGPD",
              workflow: 0,
            },
          ],
        },
        {
          account: 5,
          title: "📈 Tokenomics Specialist",
          abstract:
            "Developing a governance token model and tokenomics for a decentralized freelance platform.",
          description: `This role is necessary for writing and deploying smart contracts that will support the governance token functions and for designing the tokenomics to ensure a balanced and sustainable economy within the platform. Objective: Create a governance token model and establish the tokenomics for the 'DeWork' decentralized freelance platform. 
            Important Aspects: The model should facilitate the economics of the platform's freelance dApp, including the distribution, earning, and spending of the tokens by users within the ecosystem. 
            Technical Overview: The development involves Solidity programming and a deep understanding of web3 technologies to seamlessly integrate with the existing decentralized infrastructure of DeWork. `,
          skills: [
            "Solidity",
            "Smart Contract Development",
            "Tokenomics",
            "Web3 Technologies",
            "Ethereum",
            "Blockchain Governance",
            "DApp Development",
          ],
          specification: 3,
          domain: 3,
          toDo: [
            {
              description:
                "Créer la tokenomics pour notre token de gouvernance",
              workflow: 0,
            },
            {
              description: "Créer le système des royalties",
              workflow: 0,
            },
            {
              description: "Publier sur medium",
              workflow: 0,
            },
            {
              description: "Documenté sur Excalidraw",
              workflow: 1,
            },
          ],
        },
        {
          account: 1,
          title: "🎨 Smart Contract Designer",
          abstract:
            "Seeking a developer with Solidity and web3 experience to optimize ERC721URIStorage-based smart contracts for gas efficiency.",
          description: `This role is required for deep technical expertise in Solidity and the Ethereum platform in order to successfully optimize smart contracts for gas efficiency. The mission calls for enhancing the gas efficiency of existing smart contracts, which are based on the ERC721URIStorage standard. This involves deep technical understanding of Ethereum's gas pricing mechanism, smart contract development, and optimization strategies.
            In particular, the backend optimization requires reviewing and rewriting contract code to reduce the computational resources necessary for contract execution, thereby minimizing associated costs.`,
          specification: 3,
          skills: [
            "Solidity",
            "Smart Contract Optimization",
            "ERC721URIStorage",
            "Ethereum Gas Mechanics",
            "Web3 Technologies",
            "Gas Efficiency Strategies",
          ],
          domain: 3,
          toDo: [
            {
              description: "Optimiser les frais en gas",
              workflow: 1,
            },
            {
              description: "Supprimer les redondances dans le contrat",
              workflow: 1,
            },
            {
              description:
                "Décider si le contrat mission est utile et si il ne serait pas intéressant de le mettre dans la db et tout faire passer par l'uri de feature",
              workflow: 0,
            },
            {
              description: "Documenté sur Excalidraw",
              workflow: 1,
            },
            {
              description: "Publier sur notion",
              workflow: 1,
            },
          ],
        },
        {
          account: 4,
          title: "📚 Technical Writer",
          abstract:
            "Develop comprehensive documentation for a decentralized freelance platform's dApp, focusing on user guides and contributor instructions.",
          description: `To ensure the documentation is accurate, comprehensive and technically sound, catering to both users and contributors. A developer with Rust experience is preferred as it is presumed that the project is built using Rust, and deeper insights into the language and its ecosystem will produce better documentation. The mission involves creating extensive and detailed documentation for the decentralized application (dApp) related to 'DeWork' - a decentralized freelance platform. This documentation should cater to both users and contributors of the platform, providing them with clear and concise instructions and guidelines for engaging with the app efficiently.
            As the client requires a developer with Rust experience for this enterprise-level project, it's essential that the developer is not only skilled in coding but also in understanding the user and contributor experience to generate useful documentation. `,
          specification: 3,
          domain: 9,
          skills: [
            "Technical Writing",
            "Understanding of dApp structure and functionality",
            "Enterprise-level development experience",
            "Knowledge of decentralized platforms and blockchain technology",
          ],
          toDo: [
            {
              description: "Écrire la documentation sur le protocole",
              workflow: 0,
            },
            {
              description: "Remplir les champs lorem du site",
              workflow: 0,
            },
            {
              description: "Créer les emails de notifications",
              workflow: 0,
            },
            {
              description: "Faire un tutoriel pour les news users",
              workflow: 0,
            },
          ],
        },
        {
          account: 4,
          title: "🧭 Project Manager",
          abstract:
            "To oversee the project's progress and ensure timely delivery",
          description: `To ensure the documentation is accurate, comprehensive and technically sound, catering to both users and contributors. A developer with Rust experience is preferred as it is presumed that the project is built using Rust, and deeper insights into the language and its ecosystem will produce better documentation. The mission involves creating extensive and detailed documentation for the decentralized application (dApp) related to 'DeWork' - a decentralized freelance platform. This documentation should cater to both users and contributors of the platform, providing them with clear and concise instructions and guidelines for engaging with the app efficiently.
            As the client requires a developer with Rust experience for this enterprise-level project, it's essential that the developer is not only skilled in coding but also in understanding the user and contributor experience to generate useful documentation. `,
          specification: 3,
          skills: ["Lead dev", "Project manager", "Gestion project"],
          domain: 9,
          toDo: [
            {
              description: "Créer une entreprise",
              workflow: 0,
            },
            {
              description: "S'annoncer sur les réseaux",
              workflow: 0,
            },

            {
              description: "Contacter une banque pour ouvrir un compte",
              workflow: 0,
            },
            {
              description: "Choisir le statut d'entreprise",
              workflow: 0,
            },
            {
              description: "Créer les contrats d'entreprises",
              workflow: 0,
            },
            {
              description: "Engager tout les développeurs",
              workflow: 1,
            },
          ],
        },
        {
          account: 3,
          title: "🤖 AI Engeneer",
          abstract:
            "Develop a recommendation system for project managers leveraging GPT to suggest the best processes for mission success, utilizing the app's database for structured and relevant advice.",
          description: `An AI Developer is needed to create the GPT-based recommendation engine and integrate it with the existing application database to provide structured and relevant process recommendations.
            Implement a solution to enable project managers to receive recommendations during the creation of a mission from a GPT. This AI should recommend the best process for carrying out the mission effectively. The GPT must integrate with the existing app's database to ensure that its advice is increasingly structured and aligns with standard practices.
            Additional Context: The company seeking the developer is DeWork - a decentralized freelance platform requiring someone with Solidity expertise and Web3 experience.`,
          specification: 6,
          domain: 6,
          skills: [
            "AI/ML knowledge",
            "Expertise in GPT (Generative Pretrained Transformers)",
            "Understanding of NLP (Natural Language Processing)",
            "Experience with databases and data integration",
            "Familiarity with project management processes",
            "Solidity and Web3 development experience (for context)",
          ],
          toDo: [
            {
              description: "Créer le premier repo",
              link: "https://github.com/valentindjangone/syncflow_ai",
              workflow: 2,
            },
            {
              description: "Demander à l'IA de lister les meilleurs pratiques",
              link: "https://github.com/Djangoz1/aly-final-project/blob/main/frontend/src/app/page.js",
              workflow: 1,
            },
            {
              description:
                "Ajouter un paramètre à la fonction afin que le front puissent transmettre des consignes",
              workflow: 0,
            },
            {
              description:
                "Faire un require pour que la response soit la plus précise possible",
              workflow: 0,
            },
            {
              description:
                "Permettre de générer la todo list en fonction des données des features et de la missions",
              workflow: 0,
            },
          ],
        },
      ],
    },
  ],
};

module.exports = {
  fuzzing,
};
