import { memo, useCallback, useRef, useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import api from '../services/api.js';
import { trackClick } from '../hooks/useAnalytics.js';
import { useInView } from '../hooks/useInView.js';

const initialForm = {
  name: '',
  email: '',
  message: '',
};

function validateField(name, value) {
  if (name === 'name') {
    if (!value.trim()) return 'Name is required.';
  } else if (name === 'email') {
    if (!value.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  } else if (name === 'message') {
    if (!value.trim()) return 'Message is required.';
    if (value.trim().length < 12) return 'Message should be at least 12 characters.';
  }
  return '';
}

const Contact = memo(function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sectionRef, sectionInView] = useInView({ threshold: 0.1 });
  const [formRef, formInView] = useInView();
  const debounceRef = useRef(null);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const error = validateField(name, value);
      setErrors((prev) => {
        if (error === prev[name]) return prev;
        return { ...prev, [name]: error };
      });
    }, 200);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const nextErrors = {};
    for (const [key, value] of Object.entries(form)) {
      const error = validateField(key, value);
      if (error) nextErrors[key] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('');
      return;
    }

    setIsSending(true);
    setStatus('Sending message...');

    try {
      await api.post('/contact', {
        name: form.name,
        email: form.email,
        message: form.message,
      });

      trackClick('contact_form_submit');
      setStatus('Message sent successfully. Thank you for reaching out.');
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setStatus(error.message || 'Message could not be sent. Please try again later.');
    } finally {
      setIsSending(false);
    }
  }, [form]);

  return (
    <section ref={sectionRef} className={`section contact-section ${sectionInView ? 'is-visible' : ''}`} id="contact" aria-labelledby="contact-heading">
      <SectionHeading eyebrow="Contact" title="Let's build something useful">
        Send a message about internships, project collaboration, or development opportunities.
      </SectionHeading>

      <div className="contact-section__wrapper perspective-container">
        <form
          ref={formRef}
          className={`contact-form reveal-slide-up reveal-delay-1 ${formInView ? 'is-visible' : ''}`}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form"
        >
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && <small id="name-error">{errors.name}</small>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && <small id="email-error">{errors.email}</small>}
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project or opportunity"
              rows="5"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <small id="message-error">{errors.message}</small>}
          </label>

          <button className="button button--primary" type="submit" disabled={isSending} aria-busy={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </div>
    </section>
  );
});

export default Contact;
