import { describe, it } from 'node:test'
import assert from 'node:assert'

function validateContactForm({ name, email, subject, message }) {
  const errors = {}

  if (!name || !name.trim()) {
    errors.name = 'Nama tidak boleh kosong.'
  } else if (name.trim().length < 2) {
    errors.name = 'Nama minimal 2 karakter.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !email.trim()) {
    errors.email = 'Email tidak boleh kosong.'
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Format email tidak valid.'
  }

  if (!subject || !subject.trim()) {
    errors.subject = 'Subjek tidak boleh kosong.'
  }

  if (!message || !message.trim()) {
    errors.message = 'Pesan tidak boleh kosong.'
  } else if (message.trim().length < 20) {
    errors.message = 'Pesan minimal 20 karakter.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

describe('Contact Form Validation Suite', () => {
  it('validates a completely valid submission', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Kolaborasi Proyek Kampus',
      message: 'Halo Kelompok 3, kami sangat tertarik untuk berdiskusi mengenai proyek UI lanjut Anda.',
    }
    const result = validateContactForm(input)
    assert.strictEqual(result.isValid, true)
    assert.deepStrictEqual(result.errors, {})
  })

  it('rejects empty fields', () => {
    const input = { name: '', email: '', subject: '', message: '' }
    const result = validateContactForm(input)
    assert.strictEqual(result.isValid, false)
    assert.ok(result.errors.name)
    assert.ok(result.errors.email)
    assert.ok(result.errors.subject)
    assert.ok(result.errors.message)
  })

  it('rejects invalid email formats', () => {
    const inputs = ['invalid-email', 'user@', 'user@domain', '@domain.com']
    inputs.forEach((invalidEmail) => {
      const result = validateContactForm({
        name: 'Jane Doe',
        email: invalidEmail,
        subject: 'General Inquiry',
        message: 'This is a message with sufficient character length for testing purposes.',
      })
      assert.strictEqual(result.isValid, false)
      assert.strictEqual(result.errors.email, 'Format email tidak valid.')
    })
  })

  it('enforces minimum message length of 20 characters', () => {
    const shortMessageResult = validateContactForm({
      name: 'Jane',
      email: 'jane@test.com',
      subject: 'Inquiry',
      message: 'Too short',
    })
    assert.strictEqual(shortMessageResult.isValid, false)
    assert.strictEqual(shortMessageResult.errors.message, 'Pesan minimal 20 karakter.')
  })
})

