import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Certifications from "../components/Certifications";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useScrollReveal } from "../hooks/useScrollReveal";
import {
  subscribeProfile,
  subscribeCollection,
} from "../firebase/firebaseUtils";

const Home = () => {
  useScrollReveal();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const unsubs = [
      subscribeProfile(setProfile),
      subscribeCollection("projects", setProjects, "order"),
      subscribeCollection("skills", setSkills, "order"),
      subscribeCollection("experience", setExperience, "order"),
      subscribeCollection("education", setEducation, "order"),
      subscribeCollection("certifications", setCertifications, "order"),
      subscribeCollection("achievements", setAchievements, "order"),
      subscribeCollection("gallery", setGallery, "order"),
    ];
    return () => unsubs.forEach((u) => u && u());
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} education={education} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Certifications certifications={certifications} achievements={achievements} />
        <Gallery gallery={gallery} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
};

export default Home;
