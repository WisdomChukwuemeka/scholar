import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || "mySecretKey@123";

export const SecureStorage = {
  set(key, value) {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (err) {
      console.error("Storage set error:", err);
    }
  },

  get(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // Try to parse back to object
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (err) {
      console.error("Storage get error:", err);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};
