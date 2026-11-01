<template>
  <div class="home">
    <section class="hero">
      <div class="page-container hero-grid">
        <div class="hero-copy">
          <h1>View building models in 3D and ask about them</h1>
          <p class="hero-lead">
            Upload a Revit or IFC model to a project, walk through it in the Autodesk viewer, and ask the assistant how
            many walls, doors and windows it has, which levels it spans and how large each room is.
          </p>
          <div class="hero-actions">
            <template v-if="hydrated && user.loggedIn">
              <b-button to="/projects" variant="primary" size="lg">Open your projects</b-button>
            </template>
            <template v-else>
              <b-button to="/sign_up" variant="primary" size="lg">Create an account</b-button>
              <b-button to="/sign_in" variant="outline-secondary" size="lg">Sign in</b-button>
            </template>
          </div>
        </div>
        <figure class="hero-figure">
          <img
            src="/images/viewer-apartment-block.jpg"
            width="1600"
            height="1000"
            alt="The 3D viewer showing a seven-storey apartment block with rooftop skylights among plain massing blocks of the neighboring buildings, with the viewer toolbar along the bottom."
          />
          <figcaption>
            <span class="caption-title">Apartment block, IFC</span>
            <span class="caption-meta">{{ heroFacts }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="steps-section" aria-labelledby="how-it-works">
      <div class="page-container">
        <h2 id="how-it-works">How it works</h2>
        <ol class="steps">
          <li>
            <h3>Create a project</h3>
            <p>A project holds the models of one building. Each project gets its own storage bucket on Autodesk Platform Services.</p>
          </li>
          <li>
            <h3>Upload a model</h3>
            <p>Revit, IFC, Navisworks, DWG and other files go straight to storage, then Autodesk translates them for the browser viewer.</p>
          </li>
          <li>
            <h3>Explore and ask</h3>
            <p>Orbit, section and measure the model, check its summary, or type a question to the assistant.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="ask-section" aria-labelledby="what-to-ask">
      <div class="page-container ask-grid">
        <div>
          <h2 id="what-to-ask">What you can ask</h2>
          <p class="text-secondary-ink">
            The chat runs on a Dialogflow agent. It recognizes the question; the answer is read from the model you have
            open, so it is always about your building.
          </p>
        </div>
        <dl class="questions">
          <div v-for="item in questions" :key="item.q" class="question-row">
            <dt>{{ item.q }}</dt>
            <dd>{{ item.a }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      hydrated: false,
      heroFacts: '10 levels, 390 walls, 126 doors, 263 windows',
      questions: [
        { q: 'How many walls are there?', a: 'Counts them and isolates them in the viewer.' },
        { q: 'How many levels are there?', a: 'Lists the levels from the lowest up.' },
        { q: 'What is the size of room 24?', a: 'Gives its floor area and highlights it.' },
        { q: 'What are the walls made of?', a: 'Lists the wall materials used most.' },
        { q: 'Explode the model', a: 'Pulls the model apart so you can see its parts.' }
      ]
    }
  },
  head: {
    title: null
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  mounted() {
    this.hydrated = true
  }
}
</script>

<style scoped>
.hero {
  border-bottom: 1px solid var(--c-line);
  background: var(--c-surface);
}

.hero-grid {
  display: grid;
  gap: 40px;
  padding-top: 48px;
  padding-bottom: 56px;
}

.hero-copy h1 {
  font-size: 2.25rem;
  line-height: 1.12;
  letter-spacing: -0.02em;
  max-width: 14em;
}

.hero-lead {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--c-ink-2);
  max-width: 34em;
  margin: 20px 0 32px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-figure {
  margin: 0;
  border: 1px solid var(--c-line-strong);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #f4f5f8;
}

.hero-figure img {
  display: block;
  width: 100%;
  height: auto;
}

.hero-figure figcaption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--c-line-strong);
  background: var(--c-surface);
  font-size: 0.8125rem;
}

.caption-title {
  font-weight: 600;
}

.caption-meta {
  color: var(--c-muted);
  font-variant-numeric: tabular-nums;
}

.steps-section {
  padding: 64px 0 56px;
}

.steps {
  list-style: none;
  counter-reset: step;
  display: grid;
  gap: 32px;
  margin: 32px 0 0;
  padding: 0;
}

.steps li {
  counter-increment: step;
  position: relative;
  padding-top: 20px;
  border-top: 2px solid var(--c-ink);
}

.steps li::before {
  content: counter(step);
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--c-accent);
  font-variant-numeric: tabular-nums;
}

.steps h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.steps p {
  color: var(--c-ink-2);
  margin: 0;
}

.ask-section {
  padding: 56px 0 72px;
  background: var(--c-canvas);
  border-top: 1px solid var(--c-line);
}

.ask-grid {
  display: grid;
  gap: 32px;
}

.questions {
  margin: 0;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.question-row {
  display: grid;
  gap: 4px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--c-line);
}

.question-row:last-child {
  border-bottom: 0;
}

.questions dt {
  font-weight: 600;
}

.questions dd {
  margin: 0;
  color: var(--c-ink-2);
}

@media (min-width: 768px) {
  .hero-copy h1 {
    font-size: 2.75rem;
  }

  .steps {
    grid-template-columns: repeat(3, 1fr);
  }

  .question-row {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
  }
}

@media (min-width: 992px) {
  .hero-grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    align-items: center;
    gap: 56px;
    padding-top: 72px;
    padding-bottom: 80px;
  }

  .ask-grid {
    grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
    gap: 56px;
  }
}
</style>
