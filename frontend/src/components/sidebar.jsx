import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaProjectDiagram, FaMapMarkerAlt, FaBook, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const sidebarVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

const linkVariants = {
  initial: { opacity: 0, y: -10, scale: 1, fontWeight: 'normal' },
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  hover: { scale: 1.1, fontWeight: 'bold' }
};

const Sidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSideBar = () => {
    if (window.innerWidth <= 640) {
      setIsOpen(!isOpen);
    }
  }

  return (
    <>
      <div className="sm:hidden fixed top-4 left-4 z-50">
        {isOpen ? (
          <FaTimes className="text-2xl cursor-pointer text-white" onClick={toggleSideBar} />
        ) : (
          <FaBars className="text-2xl cursor-pointer text-black" onClick={toggleSideBar} />
        )}
      </div>
      <motion.div
        className={`fixed top-0 left-0 pt-10 pb-4 h-full bg-primary text-secondary min-h-screen transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:flex sm:flex-col sm:justify-between sm:w-36 lg:w-64 md:w-48 sm:pt-0`}
        initial={{ x: -100 }}
        animate={{ x: isOpen ? 0 : -300, transition: { duration: 0.4 } }}
        variants={sidebarVariants}
      >
        <motion.div variants={linkVariants} whileHover="hover"
          onClick={toggleSideBar}
          className='flex items-center justify-center mt-4 space-x-2 mb-4 sm:mb-0'>
          <img src='/IOT.svg' alt='logo' className='w-14 h-14 sm:w-10 sm:h-10 md:w-14 md:h-14  rounded-xl' />
          <p className='font-semibold md:text-xl'>IoT Dashboard</p>
        </motion.div>

        <nav className='text-center text-xl space-y-2 flex flex-col'>
          <motion.div variants={linkVariants} whileHover="hover" onClick={toggleSideBar}>
            <Link to="/" className="pl-4 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 flex items-center space-x-2">
              <FaHome className="text-lg" />
              <span>Home</span>
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover" onClick={toggleSideBar}>
            <Link to="/projects" className='pl-4 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 flex items-center space-x-2'>
              <FaProjectDiagram className="text-lg" />
              <span>Projects</span>
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover" onClick={toggleSideBar}>
            <Link to="/LiveTracking" className='pl-4 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 flex items-center space-x-2'>
              <FaMapMarkerAlt className="text-lg" />
              <span>LiveTracking</span>
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover" onClick={toggleSideBar}>
            <Link to="/Tutorial" className='pl-4 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 flex items-center space-x-2'>
              <FaBook className="text-lg" />
              <span>Tutorial</span>
            </Link>
          </motion.div>
        </nav>

        <div className='text-center text-xl mb-4 space-y-2'>
          <motion.div variants={linkVariants} whileHover="hover" 
          onClick={toggleSideBar}
          className='pl-5 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 cursor-pointer flex items-center space-x-2'>
            <FaUser className="text-lg" />
            <span>Profile</span>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover" className='pl-5 lg:pl-12 py-3 mx-5 sm:mx-1 md:mx-5 hover:bg-secondary hover:text-primary rounded-xl transition duration-300 cursor-pointer flex items-center space-x-2'
            onClick={() => logout()} >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default Sidebar;