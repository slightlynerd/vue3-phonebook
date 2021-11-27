import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
    contacts: [],
    filteredContacts: [],
    editMode: false,
    editIndex: false,
  },
  mutations: {
    addContact(state, contact) {
      if (state.editMode) {
        state.contacts[state.editIndex].firstName = contact.firstName;
        state.contacts[state.editIndex].lastName = contact.lastName;
        state.contacts[state.editIndex].email = contact.email;
        state.contacts[state.editIndex].phone = contact.phone;
        state.editMode = false;
        state.editIndex = null;
        return;
      }
      state.contacts.push({
        id: Date.now(),
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      });
      state.filteredContacts = [...state.contacts];
    },
    editContact(state, index) {
      state.editMode = true;
      state.editIndex = index;
      state.filteredContacts = [...state.contacts];
    },
    deleteContact(state, index) {
      state.contacts.splice(index, 1);
      state.filteredContacts = [...state.contacts];
    },
    searchContact(state, search) {
      state.filteredContacts = state.contacts.filter(
        (contact) => contact.firstName.toLowerCase().includes(search.toLowerCase())
          || contact.lastName.toLowerCase().includes(search.toLowerCase())
          || contact.email.toLowerCase().includes(search.toLowerCase())
          || contact.phone.toLowerCase().includes(search.toLowerCase()),
      );
    },
  },
  plugins: [vuexLocal.plugin],
});
