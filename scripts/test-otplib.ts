import { generateSecret, generateSync, verifySync, generateURI } from "otplib";

const secret = generateSecret();
console.log("Secret:", secret);

const token = generateSync({ secret });
console.log("Generated Token:", token);

const checkValid = verifySync({ token, secret });
console.log("Verify Valid Token:", checkValid);

const checkInvalid = verifySync({ token: "000000", secret });
console.log("Verify Invalid Token:", checkInvalid);

const uri = generateURI({
  issuer: "Cambria International College",
  label: "admin@cambria.edu",
  secret,
});
console.log("OTP URI:", uri);
