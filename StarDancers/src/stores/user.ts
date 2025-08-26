import { defineStore } from "pinia";
import { getCurrentUser } from "@/services/auth";
import { getFamilies } from "@/services/families";
import type { Family } from "@/components/FamiliesTable/ModalTable.vue";

interface User {
  email: string;
  role: {
    type: string;
  };
}

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isAdmin: false,
    family: null as Family | null,
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
      if (!this.family) {
        const family = await getFamilies(1, `email=${this.user?.email}`);
        this.family = family[0][0];
      }
    },
    async getStudents() {
      if (!this.family) {
        await this.fetchUser();
      }
      return this.family?.attributes.Students.data;
    },
    async getFamily() {
      if (!this.family) {
        await this.fetchUser();
      }
      return this.family;
    },
  },
});
