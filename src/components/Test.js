import React, { useState } from 'react';
import { Database } from './Database';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import '../stylesheets/App.css';
import '../stylesheets/Case.css';

const Test = () => {
  return (
    <div className="Test">
      <div className='TestContainer'>
        <span className='TestDescription'>
          <p>Experienced Producer who created work that has been featured in various media for clients such as Nike, Samsung, Instagram, Facebook, Montblanc, Electronic Arts and more. 10+ years of experience gained in the past, working in Film/Animation/VFX and Web Development, has led to accumulating in-depth knowledge on how the work is made and gives me the edge in producing quality work despite time and budgetary challenges. On the side enjoys exploring and learning more Test the new world of tech (AI/Unreal Engine/Web3/Metaverse) and see where that leads.</p>
          <p>Currently working as an Executive Producer Lead at Wieden+Kennedy Amsterdam.</p>
        </span>

        <Link to='/'><span className="navLink">Link</span></Link>
        <Link to='/test'><span className="navLink">test</span></Link>
        <Link to='/about'><span className="navLink">about</span></Link>
      </div>
    </div>
  );
}

export default Test;