// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Anonymous],
  // Application-side abuse protection for credential/OTP sign-in. Convex Auth
  // enforces a rolling limit of failed attempts per identifier per hour
  // (10/hr default — i.e. 10 failed codes, then one retry allowed every ~6
  // minutes). Explicit here so the protection is documented, not accidental.
  signIn: {
    maxFailedAttempsPerHour: 10,
  },
});