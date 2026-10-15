import { ref } from "vue";
import type { User } from "@/services/auth";

// Estado do usuário separado de useAuth.ts para que o router o leia sem
// puxar axios/serviços para o bundle inicial da landing page.
// Singleton de módulo: useAuth.ts escreve aqui, o router só lê.
export const user = ref<User | null>(null);
