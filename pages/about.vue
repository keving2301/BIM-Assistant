<template>
  <div class="about">
    <div class="page-container about-container">
      <h1>About</h1>
      <p class="about-lead">
        BIM Virtual Assistant is a web app for looking at building information models without desktop software. It
        began as a school project in 2020 and was refreshed in 2026.
      </p>

      <h2>Building information models</h2>
      <p>
        A building information model (BIM) is a digital description of a building: its walls, doors, windows, floors
        and rooms, with properties such as materials, levels and areas. Architects, engineers and builders use these
        models to plan, design, build and manage buildings, but opening one usually takes a desktop application and
        some training. This app puts a model in the browser and lets you ask about it in plain language.
      </p>

      <h2>How it is built</h2>
      <dl class="facts">
        <div>
          <dt>Front end</dt>
          <dd>Nuxt 2 and Vue 2 with bootstrap-vue, generated as a static site.</dd>
        </div>
        <div>
          <dt>Accounts and projects</dt>
          <dd>Firebase Authentication (email and password) and Cloud Firestore. Security rules let each account read and write only its own profile and projects.</dd>
        </div>
        <div>
          <dt>Model storage and translation</dt>
          <dd>Autodesk Platform Services: each project has a storage bucket, uploads go directly to it, and the Model Derivative service translates each file for the viewer.</dd>
        </div>
        <div>
          <dt>Server</dt>
          <dd>Netlify Functions hold the Autodesk credentials. They check the caller's Firebase sign-in on every request, so a user only reaches their own buckets.</dd>
        </div>
        <div>
          <dt>Viewer</dt>
          <dd>The Autodesk Viewer, version 7, with a model summary built from the model's own properties.</dd>
        </div>
        <div>
          <dt>Assistant</dt>
          <dd>Dialogflow Messenger. The agent recognizes the question, and the app answers it from the open model.</dd>
        </div>
      </dl>

      <h2>Sample models</h2>
      <p>
        The projects in the demo account hold sample models that their authors share under open licenses. Each one is
        uploaded unchanged to a project of its own (only the file name is simplified).
      </p>
      <dl class="facts">
        <div v-for="model in models" :key="model.name">
          <dt>{{ model.project }}</dt>
          <dd>
            {{ model.name }}: {{ model.credit }}. License:
            <a :href="model.licenseUrl" rel="noopener">{{ model.license }}</a>.
            <a :href="model.url" rel="noopener">Source</a>.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
// The models of the demo account, with the author and the license that allows showing them here. Each is uploaded
// unchanged (only the file name is simplified); the viewer shows Autodesk's translation of it.
const SAMPLE_MODELS = [
  {
    project: 'Linden Court apartments',
    name: 'AdvancedProject.ifc',
    credit: 'Andr\u00e9 Wis\u00e9n, BIM Whale sample files',
    license: 'MIT License',
    licenseUrl: 'https://github.com/andrewisen/bim-whale-ifc-samples/blob/main/LICENSE',
    url: 'https://github.com/andrewisen/bim-whale-ifc-samples'
  },
  {
    project: 'Medical-Dental Clinic',
    name: 'Clinic_Architectural.ifc',
    credit: 'BSI (2020) "Medical-Dental Test Files," buildingSMART International',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    url: 'https://github.com/buildingsmart-community/Community-Sample-Test-Files'
  },
  {
    project: 'Basic House',
    name: 'BasicHouse.ifc',
    credit: 'Andr\u00e9 Wis\u00e9n, BIM Whale sample files',
    license: 'MIT License',
    licenseUrl: 'https://github.com/andrewisen/bim-whale-ifc-samples/blob/main/LICENSE',
    url: 'https://github.com/andrewisen/bim-whale-ifc-samples'
  },
  {
    project: 'Duplex mechanical systems',
    name: 'Duplex_MEP_20110907.ifc',
    credit: 'BSI (2020) "Duplex Apartment Test Files," buildingSMART International',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    url: 'https://github.com/buildingsmart-community/Community-Sample-Test-Files'
  }
]

export default {
  name: 'About',
  data() {
    return { models: SAMPLE_MODELS }
  },
  head: {
    title: 'About'
  }
}
</script>

<style scoped>
.about-container {
  max-width: 760px;
  padding-top: 56px;
  padding-bottom: 80px;
}

.about-lead {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--c-ink-2);
  margin: 16px 0 40px;
}

h2 {
  font-size: 1.25rem;
  margin: 40px 0 12px;
}

p {
  line-height: 1.65;
}

.facts {
  margin: 16px 0 0;
  border-top: 1px solid var(--c-line);
}

.facts > div {
  display: grid;
  gap: 4px;
  padding: 16px 0;
  border-bottom: 1px solid var(--c-line);
}

.facts dt {
  font-weight: 600;
}

.facts dd {
  margin: 0;
  color: var(--c-ink-2);
}

@media (min-width: 768px) {
  .facts > div {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 24px;
  }
}
</style>
