# 🩺 Carepulse

Carepulse est une application web de gestion médicale construite avec **Next.js 15**, permettant aux professionnels de la santé de planifier, suivre et gérer efficacement les rendez-vous médicaux et les patients. Elle inclut une interface moderne, un système de thèmes (sombre), et une structure de code bien documentée pour faciliter la maintenance et les contributions.

---

![Carepulse](public/assets/images/heathcareApp-img.png)


## 📁 Structure du projet

```bash
├── public/        # Fichiers statiques (icônes, images) 
├── app/           # Dossier principal des pages et composants 
│ 
├── components/    # Composants réutilisables (UI, formulaires, etc.) 
│ 
├── patients/      # Pages servent à créer un nouveau patient, rendez-vous 
│ 
├── globals.css    # Fichier de styles globaux layout.tsx 
│ 
├── layout.tsx     # Layout principal avec configuration du thème 
│
├── loading.tsx    # Page sert à afficher un écran de chargement
│ 
└── page.tsx       # Page sert à la landing page de l’application 
├── lib/           # Fonctions utilitaires (helpers) 
│ 
├── instrumentation-client.ts       # Fichier initialisé par sentry pour le client (navigateur)
├── instrumentation.ts    # Fonction d'initialisation de Sentry en fonction du runtime utilisé 
└── utils.ts              # Fonction cn pour gérer les classes conditionnelles 
├── types/                # Déclarations de types TypeScript (ex: Appointment) 
├── .env.local            # Variables d’environnement locales (non versionnées)
├── tailwind.config.ts    # Configuration de Tailwind CSS (thème, couleurs, breakpoints)
├── tsconfig.json         # Configuration TypeScript du projet
├── README.md             # Documentation du projet, structure, usage, et informations générales.

```

## 🧰 Technologies utilisées

- **Next.js 15**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** : bibliothèque de composants UI accessible et stylée
- **Appwrite** : backend as a service pour gérer les rendez-vous et utilisateurs
- **Twilio**:  service de communication utilisé pour l’envoi de notifications SMS aux patients  (rappels de rendez-vous, confirmations, etc.)
- **React Hooks (useState, useEffect...)**
- **ESLint + Prettier** : pour la qualité et la cohérence du code

---

## 📋 Fonctionnalités principales

👉 **S'inscrire en tant que patient :**  Les utilisateurs peuvent s’inscrire et créer un profil personnel en tant que patient.

👉 **Prendre un nouveau rendez-vous avec le médecin :**  Les patients peuvent prendre rendez-vous avec des médecins à leur convenance et peuvent réserver plusieurs rendez-vous.

👉 **Gérer les rendez-vous côté administrateur :**  Les administrateurs peuvent visualiser et gérer efficacement tous les rendez-vous planifiés.

👉 **Confirmer/planifier un rendez-vous depuis le côté administrateur :**  Les administrateurs peuvent confirmer et définir les heures de rendez-vous pour s'assurer qu'elles sont correctement planifiées.

👉 **Annuler un rendez-vous depuis le côté administrateur :**  Les administrateurs ont la possibilité d’annuler tout rendez-vous si nécessaire.

👉 **Envoyer un SMS de confirmation de rendez-vous :**  Les patients reçoivent des notifications par SMS pour confirmer les détails de leur rendez-vous grâce à twilio

👉 **Téléchargement de fichiers à l'aide du stockage Appwrite :**  Les utilisateurs peuvent télécharger et stocker des fichiers en toute sécurité dans l'application à l'aide des services de stockage Appwrite.

👉 **Gérer et suivre les performances des applications à l'aide de Sentry :**  L'application utilise Sentry pour surveiller et suivre ses performances et détecter les erreurs.

---

## 🚀 Lancer le projet en local

### ✅ Prérequis

- Node.js >= 18.x
- Yarn ou npm
- Accès à une instance Appwrite ou configuration des clés d’API

### 🛠 Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Lyrecoph/healthcare.git
cd healthcare
```

```bash
# 2. Installer les dépendances
npm install
# ou
yarn install
```

```bash
# 3. Configurer les variables d'environnement
Créez un nouveau fichier nommé `.env.local` à la racine de votre projet et ajoutez le contenu suivant :
    #APPWRITE
    NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
    PROJECT_ID=
    API_KEY=
    DATABASE_ID=
    PATIENT_COLLECTION_ID=
    APPOINTMENT_COLLECTION_ID=
    NEXT_PUBLIC_BUCKET_ID=

    NEXT_PUBLIC_ADMIN_PASSKEY=587642
```
Remplacez les valeurs d'espace réservé par vos identifiants Appwrite. Vous pouvez les obtenir en vous inscrivant sur le [site web d'Appwrite](https://appwrite.io/).

```bash
# 3. Lancer le serveur en développement
npm run dev
# ou
yarn dev
```
L'application est maintenant disponible sur `http://localhost:3000`.

## 🧪 Scripts utiles

| Commande        | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Démarre le serveur Next.js en dev    |
| `npm run build` | Compile l'application pour la prod   |
| `npm run lint`  | Analyse statique avec ESLint         |
| `npm run format`| Formate le code avec Prettier        |

## 📦 Déploiement
Cette application peut être déployée sur :

- **Vercel (recommandé pour les projets Next.js)**

- **Netlify**

- **Render**

- Ou toute plateforme supportant Node.js

## 👨‍👩‍👧 Collaboration

### 🔄 Relecture du code

Le code a été refactoré avec soin et documenté pour faciliter la compréhension des nouveaux développeurs. Chaque fichier important contient des commentaires explicatifs.

### 📥 Contributions

Contributions bienvenues ! Pour proposer un changement :

1. Fork le repo

2. Crée une branche : git checkout -b feature/ta-feature

3. Commits propres avec conventional commits

4. PR avec description claire et concis


## 📝 Licence

Ce projet est sous licence MIT – libre à vous de l’utiliser, le modifier ou le distribuer.