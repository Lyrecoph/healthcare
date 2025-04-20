export default {
    hello: "Bonjour",
    patientForm: {
      intro: "Planifiez votre premier rendez-vous.",
      submit: "Soumettre",
      error: {
        creation: "Utilisateur non créé ou réponse invalide.",
        general: "Une erreur est survenue. Veuillez réessayer.",
        log: "Erreur lors de la création de l'utilisateur :"
      },
      fields: {
        name: {
          label: "Nom complet",
          placeholder: "John Doe"
        },
        email: {
          label: "Adresse Email",
          placeholder: "johndoe@gmail.com"
        },
        phone: {
          label: "Numéro de téléphone",
          placeholder: "+229 0167658025"
        }
      }
    }
  } as const;
  