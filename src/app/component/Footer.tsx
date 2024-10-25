import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className='row-start-3 flex gap-2 flex-wrap items-center justify-center'>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://github.com/Julfikar-Haidar'
        target='_blank'
        rel='noopener noreferrer'
      >
        <FaGithub width={16} height={16} />
      </a>
      <p>Julfikar Haidar</p>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://www.linkedin.com/in/julfikarhaidar6262/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <FaLinkedin width={16} height={16} />
      </a>
    </footer>
  );
}
