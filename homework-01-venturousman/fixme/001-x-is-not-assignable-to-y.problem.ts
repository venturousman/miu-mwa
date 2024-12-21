interface UserProfile {
  id: string;

  preferences: {
    theme: "light" | "dark";
  };
}

// two ways to fix this:
// one is to assign light or dark to the theme
// second is to add "blue" to the theme ("light" | "dark" | "blue") in the interface 
let user: UserProfile = {
  id: "123",
  preferences: {
    theme: "light", 
  },
};
