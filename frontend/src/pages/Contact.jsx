import { useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import api from '../services/api.js';
import { trackClick } from '../hooks/useAnalytics.js';

const initialForm = {
  name: '',
  email: '',
  message: '',
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Message is required.';
    } else if (form.message.trim().length < 12) {
      nextErrors.message = 'Message should be at least 12 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
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
  };

  return (
    <section className="section contact-section" id="contact">
      <SectionHeading eyebrow="Contact" title="Let's build something useful">
        Send a message about internships, project collaboration, or development opportunities.
      </SectionHeading>

      <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <small>{errors.name}</small>}
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
          />
          {errors.email && <small>{errors.email}</small>}
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project or opportunity"
            rows="6"
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && <small>{errors.message}</small>}
        </label>

        <button className="button button--primary" type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}

export default Contact;
