import { defineStore } from "pinia";
import axios from "axios";

export const useFeedback = defineStore({
  id: "feedbackStore",
  state: () => ({
    loading: false,
    errorMessage: "",
    response: "",
  }),
  actions: {
    sendFeedback(session_id, is_helpful) {
      this.loading = true;
      this.errorMessage = "";
      this.response = "";
      axios
        .post("feedback", { session_id, is_helpful })
        .then((response) => {
          if (response.status !== 200) {
            this.errorMessage = response.data;
          }
        })
        .catch((error) => {
          this.errorMessage = error;
        })
        .finally(() => (this.loading = false));
    },
  },
});
