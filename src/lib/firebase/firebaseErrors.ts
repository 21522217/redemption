const firebaseErrorMessages: Record<string, string> = {
  "auth/user-not-found":
    "The email is not registered. Please check your email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-email":
    "The email address is invalid. Please enter a valid email.",
  "auth/email-already-in-use":
    "The email is already in use. Try logging in or using a different email.",
  "auth/weak-password":
    "The password is too weak. Please use a stronger password.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection and try again.",
  "auth/invalid-credential":
    "Invalid login credentials. Please check your email and password and try again.",
  "auth/invalid-action-code":
    "The action code is invalid. Please try again.",
};

export function getFriendlyFirebaseErrorMessage(errorCode: string): string {
  return firebaseErrorMessages[errorCode] || "An unexpected error occurred.";
}
