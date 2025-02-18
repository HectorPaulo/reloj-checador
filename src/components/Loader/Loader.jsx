/* eslint-disable no-unused-vars */ // Disable ESLint rule for unused variables
import React from 'react'; // Import React library
import './Loader.css'; // Import CSS file for styling

const Loader = () => { // Define Loader functional component
  return (
    <div className='loader-container'> {/* Container for the loader */}
      <div className="loader"> {/* Loader element */}
        <span></span> {/* Individual loader element */}
        <span></span> {/* Individual loader element */}
        <span></span> {/* Individual loader element */}
      </div>
    </div>
  );
};

export default Loader; // Export Loader component as default