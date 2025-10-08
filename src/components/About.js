import React from 'react';
import { motion } from 'framer-motion';
// import aboutPhoto from '../images/profile_square.png';

import '../stylesheets/App.css';
import '../stylesheets/About.css';

const About = () => {
  return (
    <div className="about">
      <motion.div initial="initial" animate="animate" exit="exit" className="aboutContainer">
        <div className='aboutTitle'>
          <span>Joint Amsterdam</span>
        </div>
        <span className='aboutDescription'>
          <p>Hey there, this is the portfolio site of Joint Amsterdam - W+K's Production & Post Production Studio</p>
        </span>
        {/* <img className='aboutPhoto' alt="" src={aboutPhoto} /> */}
      </motion.div>
    </div>
  );
}

export default About;



