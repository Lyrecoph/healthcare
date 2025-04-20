export default {
  hello: "Hello",
  patientForm: {
    intro: "Schedule your first appointment.",
    submit: "Submit",
    error: {
      creation: "User not created or invalid response.",
      general: "An error occurred. Please try again.",
      log: "Error while creating user:"
    },
    fields: {
      name: {
        label: "Full Name",
        placeholder: "John Doe"
      },
      email: {
        label: "Email Address",
        placeholder: "johndoe@gmail.com"
      },
      phone: {
        label: "Phone Number",
        placeholder: "+229 0167658025"
      }
    }
  }
} as const;
