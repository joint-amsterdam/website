// src/components/Description.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from './sanityClient';

import '../stylesheets/DarkMode.css';
import '../stylesheets/App.css';
import '../stylesheets/Description.css';

const fadeTransition = { delay: 0.5, duration: 0.8, ease: 'easeOut' };
const Description = () => {
  const [description, setDescription] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "home" && (!defined(archived) || archived == false)]{
        title,
        tagline,
      }`)
      .then((data) => setDescription(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="description">
      <div className="descriptionContainer">
        {description.map((item, index) => (
          <div key={index} className="descriptionItem">

            {item.tagline && <div className="descriptionTagline">{item.tagline}</div>}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Description;
