import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || "mySecretKey@123";

export const SecureStorage = {
  set(key, value) {
    try {
      console.log(`Setting ${key} with value:`, value);
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (err) {
      console.error("Storage set error:", err);
    }
  },

  get(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) {
        console.log(`No data found for ${key}`);
        return null;
      }
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      console.log(`Decrypted ${key}:`, decrypted);
      return decrypted ? decrypted : null;
    } catch (err) {
      console.error("Storage get error:", err);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};