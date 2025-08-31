<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/stores/authStore';

const auth = useAuth();

// form fields
const username = ref('');
const password = ref('');

// handle login
const handleLogin = async () => {
  if (!username.value || !password.value) {
    return;
  }

  const res = await auth.login({
    email: username.value,  // assuming backend expects "email"
    password: password.value,
  });

  // If login success, backend sends 2FA email → redirect to verification page
  if (res) {
    console.log("Login success, go to 2FA page");
    // you can redirect using vue-router if needed
    // router.push('/auth/verify-2fa');
  }
};
</script>

<template>
  <div>
    <v-row class="mb-3">
      <v-col cols="12">
        <v-label class="font-weight-medium mb-1">Username</v-label>
        <v-text-field
            v-model="username"
            variant="outlined"
            class="pwdInput"
            hide-details
            color="primary"
        />
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-medium mb-1">Password</v-label>
        <v-text-field
            v-model="password"
            variant="outlined"
            class="border-borderColor"
            type="password"
            hide-details
            color="primary"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
            size="large"
            rounded="pill"
            color="primary"
            class="rounded-pill"
            block
            flat
            :loading="auth.isLoading"
            @click="handleLogin"
        >
          Sign In
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
