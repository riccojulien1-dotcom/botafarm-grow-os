/** Maps Supabase Auth API errors to user-facing copy. */
export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) {
    return "Too many registration attempts. Please try again in a few minutes.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Too many attempts. Please try again in a few minutes.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before logging in. Check your inbox for the confirmation link.";
  }

  if (normalized.includes("signup is disabled")) {
    return "New account registration is temporarily unavailable. Please try again later.";
  }

  return message;
}
