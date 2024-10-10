import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const encryptPin = (pin) => {
  const key = crypto.scryptSync(process.env.ExamPINSecretKey, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted =
    cipher.update(pin.toString(), "utf8", "hex") + cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};

export const decryptPin = (cipherData, iv) => {
  const key = crypto.scryptSync(process.env.ExamPINSecretKey, "salt", 32);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );
  const decrypted =
    decipher.update(cipherData, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
};
