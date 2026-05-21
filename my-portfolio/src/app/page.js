import React from 'react'
import Hero from './components/(public)/Home/Hero'
import About from './components/(public)/Home/About'
import Service from './components/(public)/Home/Service'
import Testimonal from './components/(public)/Home/Testimonal'
import CTA from './components/(public)/Home/CTA'
import Project from './components/(public)/Home/Project'

function page() {
  return (
    <div>
      <Hero/>
      <About/>
      {/* <Service/> */}
      <Project/>
      <Testimonal/>
      <CTA/>
    </div>
  )
}

export default page
