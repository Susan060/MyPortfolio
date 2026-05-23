import React from 'react'
import AboutMe from '../../components/(public)/about/AboutMe'
import PhilosophySection from '../../components/(public)/about/Philosophy'
import CoreExpertise from '../../components/(public)/about/CoreExpertise'
import ProfessionalExperience from '../../components/(public)/about/ProfessionalExperience'
import Certifications from '../../components/(public)/about/Certifications'

export const metadata = {
  title: "About Susan Adhikari | Full-Stack Web Developer",
  description: "Learn about Susan Adhikari, a full-stack web developer specializing in Next.js and MERN stack — building fast, scalable, and production-ready web applications.",
};

const page = () => {
  return (
    <>
  <AboutMe/>
  <PhilosophySection/>
  <CoreExpertise/>
  <ProfessionalExperience/>
  <Certifications/>
    </>
  

  )
}

export default page
