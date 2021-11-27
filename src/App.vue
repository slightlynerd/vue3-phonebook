<template>
  <div class="phonebook">
    <div class="header row">
      <img alt="logo" src="./assets/logo.jpeg" height="90">
      <h1>Phonebook</h1>
    </div>
    <form @submit.prevent="addToPhonebook">
      <div class="row">
        <input v-model="firstName" type="text" placeholder="First name">
        <input v-model="lastName" type="text" placeholder="Last name">
      </div>
      <div class="row">
        <input v-model="email" type="email" placeholder="Email" required>
        <input v-model="phone" type="text" placeholder="Phone" required>
      </div>
      <button :disabled="!isFormValid" type="submit" class="btn-add">
        {{ editMode ? 'Edit' : 'Add' }} Contact
      </button>
    </form>

    <h3>Contacts</h3>
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search contacts"
      class="input-search w-100"
    >
    <p v-if="!filteredContacts.length">No contacts yet! Use the form above to add a new contact.</p>
    <ul>
      <li
        v-for="(item, index) in filteredContacts"
        :key="item.id"
        class="contact"
      >
        <div class="row">
          <div class="contact-initials">
            {{ item.firstName ? item.firstName[0] : '' }}
            {{ item.lastName ? item.lastName[0] : '' }}
          </div>
          <div class="row contact-details">
            <div class="contact-info">
              <span class="contact-name">
                {{ item.firstName }} {{ item.lastName }}
              </span>
              <br>
              <span class="contact-phone">
                {{ item.phone }},
              </span>
              <span class="contact-email">
                {{ item.email }}
              </span>
            </div>
            <div class="contact-actions">
              <button @click="editNumber(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #3f51b5;transform: ;msFilter:;"><path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path></svg>
              </button>
              <button @click="deleteNumber(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: #3f51b5;transform: ;msFilter:;"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path></svg>
              </button>
            </div>
          </div>
        </div>
        <hr>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watchEffect,
  watch,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'App',

  setup() {
    // data
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const phone = ref('');
    const searchTerm = ref('');
    const isFormValid = ref(false);

    // store
    const store = useStore();

    const filteredContacts = computed(() => store.state.filteredContacts);
    const editMode = computed(() => store.state.editMode);

    function addToPhonebook() {
      store.commit('addContact', {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
      });
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      phone.value = '';
    }

    function editNumber(index) {
      const item = filteredContacts.value[index];
      firstName.value = item.firstName;
      lastName.value = item.lastName;
      email.value = item.email;
      phone.value = item.phone;
      store.commit('editContact', index);
    }

    function deleteNumber(index) {
      store.commit('deleteContact', index);
    }

    function validateEmail(e) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(e).toLowerCase());
    }

    watch(searchTerm, (newValue) => {
      store.commit('searchContact', newValue);
    });

    watchEffect(() => {
      if (
        email.value && phone.value
        && (firstName.value || lastName.value)
        && validateEmail(email.value)
      ) {
        isFormValid.value = true;
      } else {
        isFormValid.value = false;
      }
    });

    return {
      addToPhonebook,
      firstName,
      lastName,
      email,
      phone,
      deleteNumber,
      editNumber,
      filteredContacts,
      editMode,
      isFormValid,
      searchTerm,
    };
  },
});
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';
</style>
