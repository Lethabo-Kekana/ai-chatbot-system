import { defineStore } from "pinia";
import axios from "axios";

export const useChat = defineStore({
  id: "chatStore",
  state: () => ({
    loading: false,
    errorMessage: "",
    response: "",
    messageList: [
      {
        type: "text",
        author: `user1`,
        data: { text: `Hi :) I am Thabo the chat bot, how can I help?` },
      },
    ],
  }),
  getters: {
    lengthOfMessages() {
      return this.messageList.length;
    },
  },
  actions: {
    sendText(text, session_id) {
      this.loading = true;
      this.errorMessage = "";
      this.response = "";
      this.messageList.push(text);
      axios
        .post("chat", { session_id: session_id, text: text.data.text })
        .then((response) => {
          if (response.status !== 200) {
            this.errorMessage = response.data;
          }

          this.messageList.push({
            type: "text",
            author: `user1`,
            data: { text: response.data.data },
          });
        })
        .catch((error) => {
          this.errorMessage = error;
        })
        .finally(() => (this.loading = false));
    },
  },
});
