import { defineStore } from "pinia";
import { getCurrentUser } from "@/services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: undefined,
    isAdmin: false,
  }),
  actions: {
    async fetchUser() {
      if (!this.user) {
        const data = await getCurrentUser();
        if (data) {
          this.user = data;
          this.isAdmin = data.role.type === "administrador";
        }
      }
    },
  },
});
