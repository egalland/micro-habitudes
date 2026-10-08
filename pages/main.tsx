import React from 'react';
import {createRoot} from 'react-dom/client';
import Tracker from '../app/tracker';
import '../app/globals.css';
window.microLocalJournal=true;
createRoot(document.getElementById('root')!).render(<Tracker/>);
