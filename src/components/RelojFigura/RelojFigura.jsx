/* eslint-disable no-unused-vars */
import React from 'react';
import './RelojFigura.css';

const RelojFigura = () => {
    return (
        <div className="face">
            <p className="v-index">II
            </p>
            <p className="h-index">II
            </p>
            <div className="hand">
                <div className="hand">
                    <div className="hour"></div>
                    <div className="minute"></div>
                    <div className="second"></div>
                </div>
            </div>
        </div>
    );
};

export default RelojFigura;