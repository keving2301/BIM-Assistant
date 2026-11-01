<template>
  <header class="appbar">
    <a class="skip-link" href="#main">Skip to content</a>
    <b-navbar toggleable="md" class="appbar-inner" :class="wide ? 'appbar-wide' : 'page-container'">
      <nuxt-link to="/" class="brand" aria-label="BIM Virtual Assistant, home">
        <BrandMark />
        <span>BIM Virtual Assistant</span>
      </nuxt-link>

      <b-navbar-toggle target="main-nav" class="appbar-toggle">
        <template #default="{ expanded }">
          <span class="visually-hidden">{{ expanded ? 'Close menu' : 'Open menu' }}</span>
          <span class="burger" :class="{ open: expanded }" aria-hidden="true"><span /><span /><span /></span>
        </template>
      </b-navbar-toggle>

      <b-collapse id="main-nav" v-model="menuOpen" is-nav>
        <ul class="nav-links">
          <template v-if="hydrated && user.loggedIn">
            <li><nuxt-link to="/projects" class="nav-link-item">Projects</nuxt-link></li>
            <li><nuxt-link to="/profile" class="nav-link-item">Profile</nuxt-link></li>
            <li><nuxt-link to="/about" class="nav-link-item">About</nuxt-link></li>
            <li class="nav-account">
              <span class="nav-user" :title="user.data && user.data.email">{{ displayName }}</span>
              <b-button variant="outline-secondary" size="sm" @click="signOut">Sign out</b-button>
            </li>
          </template>
          <template v-else-if="hydrated && authReady">
            <li><nuxt-link to="/about" class="nav-link-item">About</nuxt-link></li>
            <li><nuxt-link to="/sign_in" class="nav-link-item">Sign in</nuxt-link></li>
            <li class="nav-account">
              <b-button to="/sign_up" variant="primary" size="sm">Create account</b-button>
            </li>
          </template>
        </ul>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: 'AppBar',
  props: {
    // The viewer uses the full window width.
    wide: { type: Boolean, default: false }
  },
  data() {
    // The prerendered HTML cannot know who is signed in; render the account links after hydration so the first
    // client render matches it.
    return { menuOpen: false, hydrated: false }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    },
    authReady() {
      return this.$store.state.authReady
    },
    displayName() {
      const data = this.user.data || {}
      return data.displayName || data.email || ''
    }
  },
  mounted() {
    this.hydrated = true
  },
  watch: {
    $route() {
      this.menuOpen = false
    }
  },
  methods: {
    async signOut() {
      await this.$fireAuth.signOut()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.appbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-line);
}

.appbar-inner {
  min-height: var(--appbar-h);
  padding-top: 0;
  padding-bottom: 0;
}

.appbar-wide {
  padding-left: 16px;
  padding-right: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--c-ink);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.01em;
  text-decoration: none;
  min-height: var(--appbar-h);
}

.brand .brand-mark {
  color: var(--c-accent);
}

.brand:hover {
  color: var(--c-ink);
  text-decoration: none;
}

.appbar-toggle {
  border: 0;
  padding: 8px;
  margin-right: -8px;
}

.burger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 22px;
  height: 22px;
}

.burger span {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: var(--c-ink);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-links {
  list-style: none;
  margin: 0;
  padding: 8px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link-item {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0;
  color: var(--c-ink-2);
  font-weight: 500;
  font-size: 0.9375rem;
  text-decoration: none;
}

.nav-link-item:hover {
  color: var(--c-ink);
}

.nav-link-item.nuxt-link-active {
  color: var(--c-accent);
}

.nav-account {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}

.nav-user {
  color: var(--c-muted);
  font-size: 0.875rem;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skip-link {
  position: absolute;
  left: 16px;
  top: -48px;
  z-index: 2000;
  padding: 8px 12px;
  background: var(--c-accent);
  color: #fff;
  border-radius: var(--radius);
}

.skip-link:focus {
  top: 8px;
}

@media (min-width: 768px) {
  .nav-links {
    flex-direction: row;
    align-items: center;
    gap: 28px;
    padding: 0;
    margin-left: auto;
  }

  .nav-link-item {
    position: relative;
    padding: 0;
    line-height: var(--appbar-h);
  }

  .nav-link-item.nuxt-link-active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--c-accent);
  }

  .nav-account {
    padding-top: 0;
    padding-left: 4px;
  }
}
</style>
