import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Page from './Page'; // Renamed the import to match the file name
import './index.css';

ReactDOM.render(
    <Router>
        <Page />
    </Router>,
    document.getElementById('root')
);
