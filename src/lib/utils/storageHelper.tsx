export const storageHelper = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(`Lỗi khi đọc localStorage key=${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Lỗi khi set localStorage key=${key}`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Lỗi khi remove localStorage key=${key}`, error);
    }
  },

  push<T>(key: string, item: T): void {
    try {
      const current = this.get<T[]>(key) || [];
      current.push(item);
      this.set(key, current);
    } catch (error) {
      console.error(`Lỗi khi push vào localStorage key=${key}`, error);
    }
  },
};
