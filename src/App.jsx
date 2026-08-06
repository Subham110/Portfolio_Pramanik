import { useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, Bot, BrainCircuit, BriefcaseBusiness, Check,
  Code2, Database, GraduationCap, MapPin, Menu, Phone, Send, Sparkles, X, ExternalLink
} from 'lucide-react'

const skills = [
  ['AI / ML', 'LLMs (GPT-4, Claude, Gemini), LangChain, LlamaIndex, RAG, Fine-tuning, Embeddings, Vector DBs'],
  ['Backend', 'Python, FastAPI, Django'],
  ['Frontend', 'React, TypeScript'],
  ['Data', 'PostgreSQL, Redis, Pinecone'],
  ['Cloud & MLOps', 'Docker, CI/CD, AWS, MLflow, Hugging Face'],
  ['Frameworks & tools', 'PyTorch, TensorFlow, Transformers, NumPy, Pandas, Matplotlib, Git, Postman, Jira']
]

const projects = [
  {
    number: '01', icon: Bot, title: 'AI Document Chat Platform',
    copy: 'A smart workspace that helps teams chat with documents, generate summaries and surface the insights that matter.',
    stack: ['Next.js', 'FastAPI', 'GPT-4o', 'Pinecone', 'AWS'],
    link: 'https://github.com/Subham110/Personal-voice-Assistant-AI-'
  },
  {
    number: '02', icon: Code2, title: 'AI Code Review Tool',
    copy: 'An AI assistant that reviews GitHub pull requests automatically, making thoughtful feedback faster and more consistent.',
    stack: ['Claude AI', 'GitHub API', 'Docker', 'Redis', 'MongoDB'],
    link: 'https://github.com/Subham110/GitHub-AI-Code-Reviewer'
  },
  {
    number: '03', icon: BrainCircuit, title: 'Multi-Agent AI Research',
    copy: 'An intelligent research team of AI agents that collaborates to write clear, well-sourced reports.',
    stack: ['Python', 'LangGraph', 'GPT-4o', 'FastAPI', 'React'],
    link: 'https://github.com/Subham110/Multi-Agent-Research'
  }
]

function SocialIcon({ name }) {
  const paths = {
    linkedin: <path d="M5.3 3.9A2.3 2.3 0 1 1 .7 3.9a2.3 2.3 0 0 1 4.6 0ZM1.1 7h4.1v13H1.1V7Zm6.7 0h3.9v1.8h.1c.5-1 1.9-2.2 4-2.2 4.3 0 5.1 2.8 5.1 6.5V20h-4.1v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V20H8.2L7.8 7Z" />,
    github: <path d="M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1 2.9.8.1-.6.4-1 .7-1.2-2.3-.3-4.8-1.2-4.8-5.1 0-1.1.4-2 1-2.8-.1-.2-.4-1.3.1-2.7 0 0 .9-.3 2.9 1.1A10 10 0 0 1 12 6.2a10 10 0 0 1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.5 1.4.2 2.5.1 2.7.7.8 1 1.7 1 2.8 0 4-2.5 4.8-4.8 5.1.4.3.7.9.7 1.8v3.6c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5Z" />,
    twitter: <path d="M18.9 7.2v.5c0 5.1-3.9 11-11 11-2.2 0-4.2-.6-5.9-1.7h.9c1.8 0 3.4-.6 4.7-1.6-1.7 0-3.1-1.1-3.6-2.7.2 0 .5.1.7.1.4 0 .7-.1 1-.1-1.7-.4-3-1.9-3-3.7v-.1c.5.3 1.1.5 1.7.5A3.8 3.8 0 0 1 3.3 6c0-.7.2-1.4.5-1.9a11 11 0 0 0 8 4.1 3.8 3.8 0 0 1 6.5-3.4c.8-.2 1.5-.5 2.2-.8-.3.8-.8 1.4-1.5 1.8.7-.1 1.3-.3 1.9-.5-.5.7-1.1 1.3-2 1.9Z" />
  }
  return <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{paths[name]}</svg>
}

function App() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('')
  const nav = ['About', 'Skills', 'Experience', 'Work', 'Contact']

  const submit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      if (!response.ok) throw new Error('Unable to send')
      setStatus('success'); setForm({ name: '', email: '', phone: '', message: '' })
    } catch { setStatus('error') }
  }

  return <>
    <header className="header">
      <a className="brand" href="#home" aria-label="Subham Pramanik home"><span>SP</span>Subham.</a>
      <nav className={open ? 'nav nav-open' : 'nav'}>
        {nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Let's talk <ArrowUpRight size={15}/></a>
      </nav>
      <button className="menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero section" id="home">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15}/> AI Engineer & product builder</p>
          <h1>I turn AI ideas into <em>useful products.</em></h1>
          <p className="lead">Building end-to-end intelligent applications—from LLM backends and RAG pipelines to delightful React experiences.</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore my work <ArrowDownRight size={19}/></a>
            <a className="button text-link" href="mailto:subhampramanik326@gmail.com">Get in touch <ArrowUpRight size={18}/></a>
          </div>
          <div className="availability"><span></span> Available for new opportunities</div>
        </div>
        <div className="hero-art" aria-label="Abstract AI interface illustration">
          <div className="orb orb-one"></div><div className="orb orb-two"></div>
          <div className="dashboard-card">
            <div className="card-top"><span className="tiny-logo"><Bot size={17}/></span><span>AI workspace</span><i></i></div>
            <div className="chat-line line-large"></div><div className="chat-line"></div>
            <div className="response"><Sparkles size={15}/><span></span><span></span><span></span></div>
            <div className="data-row"><b>94.8%</b><small>Answer confidence</small><div className="chart"><i></i><i></i><i></i><i></i><i></i></div></div>
          </div>
          <div className="floating-tag tag-one"><Database size={17}/><span>RAG pipeline</span></div>
          <div className="floating-tag tag-two"><Code2 size={17}/><span>Full stack AI</span></div>
        </div>
      </section>

      <section className="intro section" id="about">
        <p className="section-kicker">01 / About me</p>
        <div className="intro-grid"><h2>Thoughtful AI,<br/><em>built for people.</em></h2><div><p>I build production-grade AI systems that make complicated technology feel simple. From handling millions of requests to creating focused tools people genuinely enjoy using, I pair technical depth with a product mindset.</p><p>My foundation spans Python, cloud infrastructure and modern web development—so I can carry a good idea all the way to launch.</p><a href="#contact" className="underlined">More about my approach <ArrowUpRight size={16}/></a></div></div>
      </section>

      <section className="skills section" id="skills">
        <div className="section-head"><div><p className="section-kicker">02 / Capabilities</p><h2>Tools of the trade.</h2></div><p>I choose the right tools for the problem—then focus on building something reliable, maintainable and human.</p></div>
        <div className="skill-grid">{skills.map(([title, detail], index) => <article className="skill-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </section>

      <section className="experience section" id="experience">
        <p className="section-kicker">03 / Experience & education</p>
        <div className="timeline">
          <article className="timeline-card active"><div className="timeline-icon"><BriefcaseBusiness size={22}/></div><div><p className="meta">Current · Bhubaneswar</p><h3>AI Engineer Intern <span>at DeepSurge AI</span></h3><p className="timeline-copy">Building accurate document intelligence, real-time AI chat and data dashboards. I lead small delivery teams, fine-tune models for specialised use cases and deploy cost-efficient cloud systems.</p><a href="https://www.linkedin.com/company/deepsurge-ai/posts/?feedView=all" target="_blank" rel="noreferrer" className="underlined">Company on LinkedIn <ArrowUpRight size={16}/></a></div></article>
          <article className="timeline-card"><div className="timeline-icon neutral"><GraduationCap size={22}/></div><div><p className="meta">2024 — 2026</p><h3>Master of Computer Applications <span>· AI/ML, RAG, GenAI</span></h3><p className="timeline-copy">GEC Autonomous, Bhubaneswar, Odisha · CGPA 7.54 / 10</p></div></article>
          <article className="timeline-card"><div className="timeline-icon neutral"><GraduationCap size={22}/></div><div><p className="meta">2021 — 2024</p><h3>B.Sc. Computer Science <span>· Web, AWS, AI</span></h3><p className="timeline-copy">FM University, Baleshwar, Odisha · CGPA 7.3 / 10</p></div></article>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="section-head"><div><p className="section-kicker">04 / Selected work</p><h2>Ideas made real.</h2></div><a href="https://github.com/Subham110" target="_blank" rel="noreferrer" className="underlined">View GitHub <ArrowUpRight size={16}/></a></div>
        <div className="projects">{projects.map((project) => { const Icon = project.icon; return <article className="project" key={project.title}><div className="project-mark"><span>{project.number}</span><Icon size={32}/></div><div className="project-main"><h3>{project.title}</h3><p>{project.copy}</p><div className="pills">{project.stack.map(item => <span key={item}>{item}</span>)}</div></div><a href={project.link} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`} className="project-link"><ArrowUpRight size={23}/></a></article>})}</div>
        <a className="live-project" href="https://find-home-one.vercel.app/" target="_blank" rel="noreferrer"><span><ExternalLink size={19}/> Also explore Find Home — a live deployed project</span><ArrowUpRight size={20}/></a>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-copy"><p className="section-kicker">05 / Contact</p><h2>Have an idea?<br/><em>Let's build it.</em></h2><p>Whether it is a new AI product, a complex problem or an interesting opportunity, my inbox is open.</p><a href="mailto:subhampramanik326@gmail.com" className="email-link">subhampramanik326@gmail.com <ArrowUpRight size={18}/></a><div className="contact-details"><span><MapPin size={17}/> Bhubaneswar, Odisha</span><span><Phone size={17}/> +91 7854926631</span></div><div className="socials"><a href="https://www.linkedin.com/in/subham-pramanik-9b7601323/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon name="linkedin" /></a><a href="https://github.com/Subham110" target="_blank" rel="noreferrer" aria-label="GitHub"><SocialIcon name="github" /></a><a href="https://x.com/Subham6631" target="_blank" rel="noreferrer" aria-label="X / Twitter"><SocialIcon name="twitter" /></a></div></div>
        <form className="contact-form" onSubmit={submit}><div className="form-row"><label>Name<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name"/></label><label>Email<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com"/></label></div><label>Phone number <small>(optional)</small><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 00000 00000"/></label><label>Message<textarea required rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell me a little about what you're working on..."/></label>{status === 'success' && <p className="form-status success"><Check size={17}/> Thanks—your message has been sent.</p>}{status === 'error' && <p className="form-status error">Couldn’t send your message. Please email me directly.</p>}<button className="button primary submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <Send size={18}/></button></form>
      </section>
    </main>
    <footer><a className="brand" href="#home"><span>SP</span>Subham.</a><p>© {new Date().getFullYear()} Subham Pramanik. Built with care.</p><a href="#home" className="top">Back to top <ArrowUpRight size={15}/></a></footer>
  </>
}

export default App
