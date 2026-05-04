import { useState } from 'react';
import emailjs from '@emailjs/browser';
import SectionHeading from '../components/SectionHeading.jsx';

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

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('Email service is not configured yet. Add your EmailJS keys to the .env file.');
      return;
    }

    setIsSending(true);
    setStatus('Sending message...');

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: '12hibr13@gmail.com',
        },
        {
          publicKey,
        },
      );

      setStatus('Message sent successfully. Thank you for reaching out.');
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setStatus('Message could not be sent. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <SectionHeading eyebrow="Contact" title="Let’s build something useful">
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
