import { useState } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // Later we’ll use Firebase auth, but for now just simulate
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    // After login → go to tabs
    return <Redirect href="../(tabs)/home" />;
  } else {
    // Not logged in → go to login page
    return <Redirect href="/(auth)/login" />;
  }
}
