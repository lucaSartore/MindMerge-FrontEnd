<script setup>
  import {getGoogleRedirectUrl} from "../util/back_end_calls.js";
  
  async function logInWithGoogle() {
    console.log("Redirecting to Google login page");
    const redirectUrl = await getGoogleRedirectUrl();
    window.location.href = redirectUrl;
  }


</script>

 <template>

  <main>
    <button @click="logInWithGoogle" class="google-signup-button">
      Sign up with Google
    </button>
  </main>
</template>




<!-- <template>
  <main>
    <h1>Sign Up</h1>
    This is where you can sign up to the MindMerge platform.

  </main>
</template> -->
