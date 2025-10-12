import React from 'react';
import { motion } from 'framer-motion';

import '../stylesheets/App.css';
import '../stylesheets/Home.css';

const Home = () => {
  return (
    <div className="home">
      <motion.div initial="initial" animate="animate" exit="exit" className="homeContainer">
        <div className='homeTitle'>
          <span>Welcome to Joint</span>
        </div>
        <span className='homeDescription'>
          <p>video slider</p>
          <p>description:</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras erat massa, dapibus sit amet ante non, convallis vehicula ex. Nulla sagittis feugiat neque vitae dictum. Pellentesque pulvinar, urna a dignissim tempus, diam leo suscipit augue, ac pretium mauris velit quis purus. Cras fringilla sed justo sed laoreet. Curabitur posuere in velit at mollis. 
            Vestibulum eget venenatis purus. Donec sagittis, leo at elementum feugiat, felis ligula luctus libero, nec congue est odio sed risus. In hac habitasse platea dictumst. Sed ullamcorper nisl in condimentum cursus. Sed malesuada laoreet semper. Aenean lorem dui, tristique vitae sem ut, semper consequat justo. Nulla turpis dolor, semper id urna vel, consequat imperdiet mi.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin iaculis, ligula quis aliquam porttitor, justo nisl gravida quam, id interdum dolor leo id sem. In hac habitasse platea dictumst. 
            Sed tincidunt, libero ut venenatis ornare, orci orci imperdiet enim, in varius ex tortor eget nulla. Nullam eleifend bibendum volutpat. Etiam pellentesque malesuada dui, nec venenatis lacus tempus vel. Aenean imperdiet scelerisque dignissim. 
          </p>
        </span>
      </motion.div>
    </div>
  );
}

export default Home;



