import React, { useEffect, useState, useRef, Component } from "react";
import db from '../Database';
import Select from 'react-select'
import '../components/Calculator.css';

function Admin(props) {
    const [isLoaded, setLoaded] = useState(true);
    const [error, setError] = useState(null);
    const RewardForm = useRef(null);
    const [dropdownType, setdropdownType] = useState([]);
    const [dropdownContract, setdropdownContract] = useState([]);
    const [typeOptions, settypeOptions] = useState([]);
    const [contractOptions, setcontractOptions] = useState([]);
    let reward = 0;
    const [labelText, setLabelText] = useState(0);

    const test = async (event) => {
        db.jsontoFirestore();
    }


if (error) {
    return <div>Error: {error.message}</div>;
} else if (!isLoaded) {
    return <div>Loading...</div>;
} else {
    return (
        <article id="appPage">
            <article id="tabPage">
                <div class="container">
                    <div classname="header"><h1></h1></div>
                    <div className="Username"><input type="textarea" name={'Username'} /><br /></div>
                            <div className="sub2"><input type="submit" value="Create Contract" onClick={test} /></div>
                </div>
                </article>
            </article>
            )
        }
    }
    /*
    <div className="sub1"><input type="submit" value="Opret Udstyr" onClick={handleOpret} /></div>
    <div className="sub2"><input type="submit" value="Rediger Udstyr" onClick={handleRediger} /></div>
    <div className="sub3"><input type="submit" value="Slet Udstyr" onClick={handleSlet} /></div>
    */
    export default Admin;