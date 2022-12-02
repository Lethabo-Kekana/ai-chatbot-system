<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showEdition="true"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="loading ? 'test' : ''"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />
    <!-- <a href="#" @click.prevent="openChat()">Open the chat window </a> -->
  </div>

  <!-- <RouterView /> -->
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useChat } from "./stores/chat";
import { useFeedback } from "./stores/feedback";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
const chatStore = useChat();
const feedbackStore = useFeedback();

let { loading, messageList } = storeToRefs(chatStore);
const participants = reactive([
  {
    id: "user1",
    name: "Thabo",
    imageUrl:
      "https://raw.githubusercontent.com/Lethabo-Kekana/ai-chatbot-system/main/chat-bot-v2-master/src/assets/Tutlogo.png",
  },
]);

const titleImageUrl = ref(
  "https://raw.githubusercontent.com/Lethabo-Kekana/ai-chatbot-system/main/chat-bot-v2-master/src/assets/Tutlogo.png"
);

const newMessagesCount = ref(0);
const isChatOpen = ref(false);

const colors = reactive({
  header: {
    bg: "#e91606",
    text: "#ffffff",
  },
  launcher: {
    bg: "#e91606",
  },
  messageList: {
    bg: "#ffffff",
  },
  sentMessage: {
    bg: "#e91606",
    text: "#ffffff",
  },
  receivedMessage: {
    bg: "#eaeaea",
    text: "#222222",
  },
  userInput: {
    bg: "#f4f7f9",
    text: "#565867",
  },
});

const alwaysScrollToBottom = ref(false);
const messageStyling = ref(true);
const session_id = ref("");
const messageListCache = ref(0);

function setUUID() {
  session_id.value = uuidv4();
  console.log("session id", session_id.value);
}
onMounted(() => {
  setUUID();
});
function onMessageWasSent(message) {
  // messageList.push(message);
  chatStore.sendText(message, session_id.value);
}
function openChat() {
  isChatOpen.value = true;
  newMessagesCount.value = 0;
}
function closeChat() {
  isChatOpen.value = false;
  if (
    chatStore.lengthOfMessages > 1 &&
    messageListCache.value !== chatStore.lengthOfMessages
  ) {
    Swal.fire({
      icon: "question",
      title: "Bot Feedback",
      text: "Did the bot help you?",
      footer:
        '<a href="#">Click here for any extend feedback or compliments.</a>',
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        feedbackStore.sendFeedback(session_id.value, true);
        Swal.fire("Thanks for the feedback.", "", "success");
      }
      if (result.isDenied) {
        feedbackStore.sendFeedback(session_id.value, false);
        Swal.fire(
          "Sorry about that and thanks for the feedback.",
          "",
          "success"
        );
      }
      messageListCache.value = chatStore.lengthOfMessages;
      setUUID();
    });
  }
}
// function handleScrollToTop() {
//   // called when the user scrolls message list to top
//   // leverage pagination for loading another page of messages
// }

function handleOnType() {
  // console.log("Emit typing event");
}

function editMessage(message) {
  const m = messageList.find((m) => m.id === message.id);
  m.isEdited = true;
  m.data.text = message.data.text;
}
</script>
<style>
.sc-header--img {
  border-radius: 50%;
  align-self: center;
  padding: 10px;
  background-color: #ffffff;
}
</style>
