// import { create } from "zustand";
// import apiRequest from "./apiRequest";

// export const useNotificationStore = create((set) => ({
//   number: 0,
//   fetch: async () => {
//     const res = await apiRequest("/users/notification");
//     set({ number: res.data });
//   },
//   decrease: () => {
//     set((prev) => ({ number: prev.number - 1 }));
//   },
//   reset: () => {
//     set({ number: 0 });
//   },
// }));
import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      set({ number: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  },
  decrease: () => {
    set((prev) => ({ number: Math.max(0, prev.number - 1) }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
