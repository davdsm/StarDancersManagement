import { defineStore } from "pinia";
import { getCurrentUser } from "@/services/auth";
import { getFamilies, getFamilyById, getFamilyByStudentId } from "@/services/families";
import type { Family } from "@/components/FamiliesTable/ModalTable.vue";
import axios from "axios";
import qs from "qs";

interface User {
  email: string;
  role: {
    type: string;
  };
  family?: {
    id: number;
  };
}

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isAdmin: false,
    family: null as Family | null,
    students: [] as any[],
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

      // For non-admin users, fetch students
      if (!this.isAdmin && this.user?.email) {
        // 1. Fetch students by ParentEmail
        const query = qs.stringify(
          {
            publicationState: "live",
            sort: ["id:desc"],
            filters: {
              ParentEmail: {
                $eq: this.user.email,
              },
            },
          },
          { encodeValuesOnly: true }
        );

        const url = `${import.meta.env.VITE_ADDRESS}/api/students?${query}`;
        const { data } = await axios.get(url, headers);
        const studentsByEmail = data.data;

        // 2. If students found, try to get Family from the first student
        if (studentsByEmail.length > 0) {
          const firstStudentId = studentsByEmail[0].id;
          const family = await getFamilyByStudentId(firstStudentId);

          if (family) {
            this.family = family;
            // 3. If family found, use its students (siblings included)
            if (this.family?.attributes?.Students?.data) {
              this.students = this.family.attributes.Students.data;
            } else {
              this.students = studentsByEmail;
            }
          } else {
            // Fallback: No family found, use students found by email
            this.students = studentsByEmail;
          }
        } else {
          this.students = [];
        }
      }

      return;
    },
    async getStudents() {
      if (this.students.length === 0) {
        await this.fetchUser();
      }
      return this.students;
    },
    async getFamily() {
      if (!this.family) {
        await this.fetchUser();
      }
      return this.family;
    },
  },
});
