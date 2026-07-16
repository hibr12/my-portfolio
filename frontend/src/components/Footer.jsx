import { useData } from '../context/DataContext.jsx';

function Footer() {
  const { settings } = useData();
  const { footer, social, contact } = settings;

  return (
    <footer className="footer">
      <div>
        <strong>{footer.name}</strong>
        <p>{footer.title}</p>
        <p>{footer.subtitle}</p>
      </div>
      <div className="footer__links">
        {social.github && (
          <a href={social.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {social.twitter && (
          <a href={social.twitter} target="_blank" rel="noreferrer">
            Twitter
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
        )}
      </div>
      <p>Copyright &copy; {new Date().getFullYear()} {footer.name}. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
