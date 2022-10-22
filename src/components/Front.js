
// Import of functions and controller
import React, { useState } from "react";
import ContentCalculator from './ContentCalculator';
import '../components/Design.css';

function Front(props) {
    const [isLoaded, setLoaded] = useState(true);
    const [error, setError] = useState(null);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <article id="FrontPage">
                <article id="FrontTabPage">
                    <div className="Tabs">
                        <ul className="nav">
                            <li className="tab1">Calculator</li>
                        </ul>
                        <div className="outlet">
                            <ContentCalculator />
                        </div>
                    </div>
                </article>
            </article>
        )
    }
}

export default Front;