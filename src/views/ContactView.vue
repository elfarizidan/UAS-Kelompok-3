<script setup>
import { ref, reactive, computed } from 'vue'
import Button from '@/components/common/Button.vue'
import { teamInfo } from '@/data/team'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validate() {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = 'Nama tidak boleh kosong.'
    valid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Nama minimal 2 karakter.'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email tidak boleh kosong.'
    valid = false
  } else if (!validateEmail(form.email)) {
    errors.email = 'Format email tidak valid.'
    valid = false
  }

  if (!form.subject.trim()) {
    errors.subject = 'Subjek tidak boleh kosong.'
    valid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Pesan tidak boleh kosong.'
    valid = false
  } else if (form.message.trim().length < 20) {
    errors.message = 'Pesan minimal 20 karakter.'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) {
    toast.error('Mohon lengkapi semua field dengan benar.')
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call — replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500))
    isSubmitted.value = true
    toast.success('Pesan berhasil dikirim! Kami akan menghubungi kamu secepatnya.')
  } catch {
    toast.error('Terjadi kesalahan. Coba lagi nanti.')
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  isSubmitted.value = false
}

const contacts = [
  {
    label: 'Email',
    value: teamInfo.email,
    href: `mailto:${teamInfo.email}`,
    icon: 'email',
  },
  {
    label: 'GitHub',
    value: 'github.com/kelompok3',
    href: teamInfo.github,
    icon: 'github',
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/company/kelompok3',
    href: teamInfo.linkedin,
    icon: 'linkedin',
    external: true,
  },
]
</script>

<template>
  <main class="contact">
    <!-- ── Header ── -->
    <section class="contact-hero">
      <div class="container">
        <div class="contact-hero__label">
          <span class="contact-hero__label-line" />
          <span>Contact</span>
        </div>
        <h1 class="contact-hero__title">Let's talk.</h1>
        <p class="contact-hero__desc">
          Punya pertanyaan tentang proyek kami, ingin berkolaborasi, atau sekadar ingin menyapa? Kami terbuka untuk semua itu.
        </p>
      </div>
    </section>

    <!-- ── Main Content ── -->
    <div class="container contact-layout">
      <!-- Form -->
      <section class="contact-form-section">
        <!-- Success state -->
        <Transition name="fade" mode="out-in">
          <div v-if="isSubmitted" class="contact-success" key="success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2>Pesan terkirim!</h2>
            <p>Terima kasih telah menghubungi kami. Kami akan membalas melalui email dalam 1–2 hari kerja.</p>
            <Button variant="outline" size="md" @click="resetForm">Kirim pesan lain</Button>
          </div>

          <!-- Form -->
          <form
            v-else
            key="form"
            class="contact-form"
            novalidate
            @submit.prevent="handleSubmit"
            aria-label="Contact form"
          >
            <div class="contact-form__row">
              <!-- Name -->
              <div class="contact-form__field" :class="{ 'contact-form__field--error': errors.name }">
                <label for="contact-name" class="contact-form__label">
                  Nama <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  type="text"
                  class="contact-form__input"
                  placeholder="Nama kamu"
                  autocomplete="name"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                />
                <p v-if="errors.name" id="name-error" class="contact-form__error" role="alert">{{ errors.name }}</p>
              </div>

              <!-- Email -->
              <div class="contact-form__field" :class="{ 'contact-form__field--error': errors.email }">
                <label for="contact-email" class="contact-form__label">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  class="contact-form__input"
                  placeholder="email@contoh.com"
                  autocomplete="email"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                />
                <p v-if="errors.email" id="email-error" class="contact-form__error" role="alert">{{ errors.email }}</p>
              </div>
            </div>

            <!-- Subject -->
            <div class="contact-form__field" :class="{ 'contact-form__field--error': errors.subject }">
              <label for="contact-subject" class="contact-form__label">
                Subjek <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-subject"
                v-model="form.subject"
                type="text"
                class="contact-form__input"
                placeholder="Tentang apa?"
                :aria-invalid="!!errors.subject"
                :aria-describedby="errors.subject ? 'subject-error' : undefined"
              />
              <p v-if="errors.subject" id="subject-error" class="contact-form__error" role="alert">{{ errors.subject }}</p>
            </div>

            <!-- Message -->
            <div class="contact-form__field" :class="{ 'contact-form__field--error': errors.message }">
              <label for="contact-message" class="contact-form__label">
                Pesan <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="contact-form__textarea"
                rows="6"
                placeholder="Tulis pesanmu di sini…"
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'message-error' : undefined"
              />
              <div class="contact-form__textarea-footer">
                <p v-if="errors.message" id="message-error" class="contact-form__error" role="alert">{{ errors.message }}</p>
                <span class="contact-form__char-count" :class="{ 'contact-form__char-count--ok': form.message.length >= 20 }">
                  {{ form.message.length }} karakter
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Mengirim…' : 'Kirim Pesan' }}
            </Button>
          </form>
        </Transition>
      </section>

      <!-- Contact info -->
      <aside class="contact-info">
        <div class="contact-info__block">
          <h2 class="contact-info__title">Informasi Kontak</h2>
          <p class="contact-info__desc">
            Hubungi kami langsung atau temukan kami di platform berikut.
          </p>

          <ul class="contact-info__list" role="list">
            <li v-for="contact in contacts" :key="contact.label" class="contact-info__item">
              <a
                :href="contact.href"
                :target="contact.external ? '_blank' : undefined"
                :rel="contact.external ? 'noopener noreferrer' : undefined"
                class="contact-info__link"
              >
                <!-- Email icon -->
                <span v-if="contact.icon === 'email'" class="contact-info__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <!-- GitHub icon -->
                <span v-else-if="contact.icon === 'github'" class="contact-info__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </span>
                <!-- LinkedIn icon -->
                <span v-else-if="contact.icon === 'linkedin'" class="contact-info__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </span>
                <div>
                  <span class="contact-info__link-label">{{ contact.label }}</span>
                  <span class="contact-info__link-value">{{ contact.value }}</span>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!-- Team blurb -->
        <div class="contact-info__team">
          <p class="contact-info__team-label">{{ teamInfo.name }}</p>
          <p class="contact-info__team-course">{{ teamInfo.course }} · {{ teamInfo.semester }}</p>
          <p class="contact-info__team-uni">{{ teamInfo.university }}</p>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.contact-hero {
  padding: calc(64px + var(--space-16)) 0 var(--space-12);
  border-bottom: 1px solid var(--color-border-subtle);
}
.contact-hero__label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}
.contact-hero__label-line {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--color-text-muted);
}
.contact-hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.0;
  margin-bottom: var(--space-5);
}
.contact-hero__desc {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 520px;
}

/* Layout */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-16);
  padding-top: var(--space-16);
  padding-bottom: var(--space-24);
  align-items: start;
}

/* Form */
.contact-form-section { }

.contact-success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  padding: var(--space-12);
  border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-success) 6%, var(--color-bg-elevated));
}
.contact-success h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.contact-success p {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}

.contact-form { display: flex; flex-direction: column; gap: var(--space-6); }
.contact-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }

.contact-form__field { display: flex; flex-direction: column; gap: var(--space-2); }
.contact-form__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}
.contact-form__label span { color: var(--color-highlight); }

.contact-form__input,
.contact-form__textarea {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  resize: vertical;
}
.contact-form__input { height: 44px; }
.contact-form__input::placeholder,
.contact-form__textarea::placeholder { color: var(--color-text-muted); }
.contact-form__input:focus,
.contact-form__textarea:focus {
  border-color: var(--color-text);
  box-shadow: 0 0 0 3px var(--color-highlight-subtle);
}
.contact-form__field--error .contact-form__input,
.contact-form__field--error .contact-form__textarea {
  border-color: var(--color-error);
}
.contact-form__field--error .contact-form__input:focus,
.contact-form__field--error .contact-form__textarea:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.contact-form__textarea-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}
.contact-form__error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin: 0;
}
.contact-form__char-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  margin-left: auto;
}
.contact-form__char-count--ok { color: var(--color-success); }

/* Info sidebar */
.contact-info {
  position: sticky;
  top: calc(64px + var(--space-6));
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
.contact-info__block {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  background: var(--color-bg-elevated);
}
.contact-info__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}
.contact-info__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.contact-info__list { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
.contact-info__link {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  background: var(--color-bg);
}
.contact-info__link:hover {
  border-color: var(--color-border);
  background: var(--color-bg-alt);
}
.contact-info__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}
.contact-info__link-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.contact-info__link-value {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: 500;
}

.contact-info__team {
  padding: var(--space-5);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-bg-alt);
}
.contact-info__team-label {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}
.contact-info__team-course,
.contact-info__team-uni {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-layout { grid-template-columns: 1fr; }
  .contact-info { position: static; }
  .contact-form__row { grid-template-columns: 1fr; }
}
</style>

