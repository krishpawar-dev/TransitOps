import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdFlashOn, MdArrowOutward, MdRoute, MdDirectionsCar, MdPeople,
  MdBarChart, MdLocalGasStation, MdBuild, MdVerifiedUser, MdInsights,
  MdAccountBalanceWallet, MdCheckCircle, MdKeyboardArrowDown
} from 'react-icons/md';
import './Home.css';

const modules = [
  { icon: <MdDirectionsCar />, number: '01', title: 'Fleet & Vehicles', text: 'Keep vehicle records, availability, status and utilisation organised in one place.' },
  { icon: <MdPeople />, number: '02', title: 'Driver Operations', text: 'Maintain driver information and get a clearer view of team availability.' },
  { icon: <MdRoute />, number: '03', title: 'Trips & Routes', text: 'Coordinate trip assignments, route details, progress and completion status.' },
  { icon: <MdBuild />, number: '04', title: 'Maintenance', text: 'Track service schedules and maintenance records before small issues grow.' },
  { icon: <MdLocalGasStation />, number: '05', title: 'Fuel & Expenses', text: 'Record fuel usage and operating costs to understand where money goes.' },
  { icon: <MdBarChart />, number: '06', title: 'Reports & Insights', text: 'Turn operational records into readable summaries for better decisions.' },
];
const steps = [
  ['01', 'Bring operations together', 'Keep vehicle, driver, trip and expense information organised instead of scattered across separate records.'],
  ['02', 'Monitor the moving parts', 'Use dashboards and status views to understand fleet activity, maintenance needs and daily workload.'],
  ['03', 'Make informed decisions', 'Review reports and operational trends to plan resources and identify opportunities to improve efficiency.'],
];

export default function Home() {
  return <main className="home-page">
    <header className="home-nav">
      <a className="home-brand" href="#top" aria-label="TransitOps home"><span className="home-brand-mark"><MdFlashOn /></span><span>Transit<span>Ops</span><small>FLEET INTELLIGENCE</small></span></a>
      <nav className="home-nav-links" aria-label="Main navigation"><a href="#overview">Overview</a><a href="#capabilities">Capabilities</a><a href="#workflow">How it works</a></nav>
      <Link className="home-nav-cta" to="/login">Open workspace <MdArrowOutward /></Link>
    </header>

    <section className="home-hero" id="top">
      <div className="hero-grid-glow" />
      <div className="hero-copy">
        <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}><span /> SMART TRANSPORT OPERATIONS</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .08 }}>Move your fleet.<br /><em>Master every detail.</em></motion.h1>
        <motion.p className="hero-description" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .16 }}>TransitOps is a fleet and transport operations management platform designed to bring vehicles, drivers, trips, maintenance and costs into one clear operational view.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .24 }}><Link to="/login" className="button-primary">Explore the workspace <MdArrowOutward /></Link><a className="button-secondary" href="#overview">Discover the platform <MdKeyboardArrowDown /></a></motion.div>
        <div className="hero-proof"><span className="proof-icon"><MdVerifiedUser /></span><span><strong>One connected workspace</strong><small>Operations · Visibility · Decisions</small></span><span className="proof-divider" /><span className="proof-note">Built for clarity at every mile.</span></div>
      </div>
      <motion.div className="hero-visual" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, delay: .2 }}>
        <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
        <div className="visual-topline"><span><i /> OPERATIONS OVERVIEW</span><span>LIVE VIEW</span></div>
        <div className="visual-main-card"><div className="visual-card-heading"><div><small>FLEET PERFORMANCE</small><h3>Your operations, at a glance.</h3></div><span className="visual-menu">•••</span></div>
          <div className="visual-metrics"><div><span>Fleet availability</span><strong>92.4<small>%</small></strong><div className="mini-track"><i style={{width:'92%'}} /></div></div><div><span>Trips in progress</span><strong>24</strong><small className="metric-caption">Across active routes</small></div></div>
          <div className="visual-chart-label"><span>Weekly trip activity</span><span className="chart-legend"><i /> Completed</span></div>
          <div className="visual-chart" aria-label="Illustrative weekly activity chart"><div className="chart-y"><span>80</span><span>60</span><span>40</span><span>20</span></div><div className="chart-bars">{[42,62,48,76,57,88,68].map((h,i)=><div className="chart-bar-wrap" key={i}><i style={{height:`${h}%`}} /><span>{['M','T','W','T','F','S','S'][i]}</span></div>)}</div></div>
          <div className="visual-bottom"><span className="bottom-icon"><MdRoute /></span><span><strong>Connected operations</strong><small>Trips, vehicles and teams in sync</small></span><MdArrowOutward className="bottom-arrow" /></div>
        </div>
        <div className="floating-chip chip-top"><span className="chip-icon green"><MdCheckCircle /></span><span><strong>Fleet visibility</strong><small>At a glance</small></span></div>
        <div className="floating-chip chip-bottom"><span className="chip-icon gold"><MdInsights /></span><span><strong>Smarter decisions</strong><small>Driven by your data</small></span></div>
      </motion.div>
      <a className="scroll-cue" href="#overview"><span /> SCROLL TO EXPLORE</a>
    </section>

    <section className="home-overview" id="overview"><div className="section-kicker">01 / THE PLATFORM</div><div className="overview-layout"><div><h2>One platform.<br /><em>Every moving part.</em></h2></div><div className="overview-copy"><p>Transport operations involve more than vehicles on the road. They depend on people, schedules, servicing, fuel and costs working together. TransitOps brings these operational areas into a unified management experience.</p><p>This project demonstrates how a digital fleet management system can help teams organise day-to-day work, monitor key information and understand performance from a single workspace.</p></div></div>
      <div className="principle-strip"><div><span>01</span><strong>Centralised records</strong><small>Keep key operational data organised.</small></div><div><span>02</span><strong>Operational visibility</strong><small>See activity and status more clearly.</small></div><div><span>03</span><strong>Data-led decisions</strong><small>Use reports to support planning.</small></div></div>
    </section>

    <section className="home-capabilities" id="capabilities"><div className="section-heading"><div><div className="section-kicker">02 / CORE CAPABILITIES</div><h2>Designed around the<br /><em>work that matters.</em></h2></div><p>Explore the key areas of the TransitOps project and the role each one plays in managing a transport operation.</p></div><div className="capability-grid">{modules.map((m,i)=><motion.article className="capability-card" key={m.number} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.45,delay:i*.05}}><div className="capability-card-top"><span className="capability-icon">{m.icon}</span><span className="capability-number">{m.number}</span></div><h3>{m.title}</h3><p>{m.text}</p><span className="capability-line" /></motion.article>)}</div></section>

    <section className="home-workflow" id="workflow"><div className="workflow-intro"><div className="section-kicker">03 / HOW IT WORKS</div><h2>From daily tasks to<br /><em>the bigger picture.</em></h2><p>The project follows a simple operational flow: capture useful records, monitor activity and use the resulting information to guide decisions.</p><Link to="/login" className="text-link">Enter TransitOps <MdArrowOutward /></Link></div><div className="workflow-steps">{steps.map(([n,title,text])=><div className="workflow-step" key={n}><span className="step-number">{n}</span><div><h3>{title}</h3><p>{text}</p></div><MdArrowOutward className="step-arrow" /></div>)}</div></section>

    <section className="home-project-note"><div className="note-symbol"><MdAccountBalanceWallet /></div><div><div className="section-kicker">PROJECT AT A GLANCE</div><h2>What this project is built to demonstrate</h2><p>A unified interface for fleet administration, operational tracking and reporting. The application includes dedicated areas for vehicles, drivers, trips, maintenance, fuel logs, expenses, reports and settings.</p><p className="note-small">Note: dashboard figures and visualisations may use sample/demo data depending on the connected backend and current project configuration.</p></div><Link to="/login" className="note-cta">View the application <MdArrowOutward /></Link></section>

    <footer className="home-footer"><a className="home-brand footer-brand" href="#top"><span className="home-brand-mark"><MdFlashOn /></span><span>Transit<span>Ops</span><small>FLEET INTELLIGENCE</small></span></a><p>Clearer operations. Better journeys.</p><span>© {new Date().getFullYear()} TransitOps · Transport Operations Management</span></footer>
  </main>;
}
