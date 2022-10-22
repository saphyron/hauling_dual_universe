// Import of functions and controller
import React, { useEffect, useState, useRef, Component } from "react";
import db from '../Database';
import Select from 'react-select'
import '../components/Contracts.css';
import { Navigate } from 'react-router-dom';

function Contracts(props) {
    const [isLoaded, setLoaded] = useState(true);
    const [error, setError] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);




    useEffect(() => {
        const getContracts = async () => {
            let snapshot = await db.getAllContracts();
            setTimeout(10000);
            if (snapshot) {
                setError(null);
                setLoaded(true);
                const _equipment = [];
                snapshot.forEach((item, i) => {
                    _equipment.push({
                        value: item, date: item.Dato, status: item.Status,
                        start: item.StartLocation, end: item.EndLocation,
                        col: item.Collateral, reward: item.Reward

                    });
                })
                setEquipment(_equipment);

            } else {
                setLoaded(false);
            }
        }
        getContracts();

    }, [])

    const handleClick = (e) => {
        let target = e.target;
        let selectedEquipmentIndex = target.parentElement.getAttribute("dataset-id");
        setSelectedEquipment(selectedEquipmentIndex);
        console.log(selectedEquipment);
    }



    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (selectedEquipment) {
        return (<Navigate to = {
            {
                pathname: "/contracts/" + selectedEquipment,
                state: {
                    title: selectedEquipment
                }
            }
        } />)
    } else {
        return (
            <article id="header">
                <article id="content">
                    <section class="container">
                        <div classname="header"><h1></h1></div>
                        <div className="titleArea">
                            <div className="eqnavn"><h1>Date: </h1></div>
                            <div className="eqstatus"><h1>Status: </h1></div>
                            <div className="eqstart"><h1>Start: </h1></div>
                            <div className="eqend"><h1>End: </h1></div>
                            <div className="eqcol"><h1>Collateral: </h1></div>
                            <div className="eqreward"><h1>Reward: </h1></div>
                        </div>
                        {equipment.map((item => (
                            <id className="row" key={item} dataset-id={item.date} onClick={handleClick}>
                                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
                                <p className="status">{item.status}</p>
                                <p className="start">{item.start}</p>
                                <p className="end">{item.end}</p>
                                <p className="col">{item.col}</p>
                                <p className="reward">{item.reward}</p>
                            </id>
                        )))}
                    </section>
                </article>
            </article>
        )
    }
}

export default Contracts;