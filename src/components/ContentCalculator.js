// Import of functions and controller
import React, { useEffect, useState, useRef, Component } from "react";
import db from '../Database';
import Select from 'react-select'
import '../components/Calculator.css';

function ContentCalculator(props) {
    const [isLoaded, setLoaded] = useState(true);
    const [error, setError] = useState(null);
    const RewardForm = useRef(null);
    const [dropdownType, setdropdownType] = useState([]);
    const [dropdownContract, setdropdownContract] = useState([]);
    const [typeOptions, settypeOptions] = useState([]);
    const [contractOptions, setcontractOptions] = useState([]);
    let reward = 0;
    const [labelText, setLabelText] = useState(0);


    useEffect(() => {
        const getTypeOfContract = async () => {
            let snapshot = await db.getTypeOfContract();
            setTimeout(10000);
            if (snapshot) {
                setError(null);
                setLoaded(true);
                snapshot.forEach((item, i) => {
                    typeOptions.push({
                        value: item, label: item, key: item
                    });
                })
            } else {
                setLoaded(false);
            }
        }
        getTypeOfContract();
    }, [])

    const setContractSize = async (event) => {
        while (contractOptions.length > 0) {
            contractOptions.pop();
        }
        let snapshot = await db.getContractsSizes(event.value);
        setTimeout(10000);
        if (snapshot) {
            setError(null);
            setLoaded(true);
            snapshot.forEach((item, i) => {
                contractOptions.push({
                    value: item, label: item, key: item
                });
            })
        } else {
            setLoaded(false);
        }
        if (dropdownType) {
            dropdownType.pop();
        }
        dropdownType.push(event.value);
    }

    const fillContractSize = async (event) => {
        if (typeOptions) {
            dropdownContract.pop();
        }
        dropdownContract.push(event.value);
    }

    const checkReward = async (e) => {
        e.preventDefault();
        const form = RewardForm.current;
        let col = form['Collateral'].value;
        let dis = form['Distance'].value;
        let diskm = form['DistanceKM'].value;
        let type = dropdownType[0];
        let contract = dropdownContract[0];
        if (col && dis && type && contract && diskm && type == 'Planet') {
            reward = await db.calculateReward(col, type, contract, dis, diskm);
        } else if (col && dis && type && contract) {
            reward = await db.calculateReward(col, type, contract, dis, 0);
        } else {
            alert("You need to fill data!");
        }
        setLabelText(reward);
        console.log(dropdownType);
        console.log(dropdownContract);
        console.log(reward);
    }

    const createContract = async (e) => {
        e.preventDefault();
        const form = RewardForm.current;
        let col = form['Collateral'].value;
        let start = form['Start Location'].value;
        let end = form['End location'].value;
        let name = form['Username'].value;
        let type = dropdownType[0];
        let contract = dropdownContract[0];
        let date = Date.now();
        if (reward < 1) {
            const form = RewardForm.current;
            let col = form['Collateral'].value;
            let dis = form['Distance'].value;
            let diskm = form['DistanceKM'].value;
            let type = dropdownType[0];
            let contract = dropdownContract[0];
            if (col && dis && type && contract && diskm && type == 'Planet') {
                reward = await db.calculateReward(col, type, contract, dis, diskm);
            } else if (col && dis && type && contract) {
                reward = await db.calculateReward(col, type, contract, dis, 0);
            } else {
                alert("You need to fill data!");
            }
            setLabelText(reward);
            console.log(dropdownType);
            console.log(dropdownContract);
            console.log(reward);
        }
        console.log(reward);
        if (col && start && end && type && contract && reward && name) {
            await db.createContract(name, col, reward, start, end, type, contract, date);
        } else {
            alert("You need to fill data!");
        }
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
                        <form ref={RewardForm}>
                            <div className="valgtType"><label>Type: </label></div>
                            <div className="udstyrType">
                                <Select options={typeOptions} onChange={setContractSize} />
                            </div>
                            <div className="valgtNavn"><label>Contract Size: </label></div>
                            <div className="udstyrNavn">
                                <Select options={contractOptions} onChange={fillContractSize} />
                            </div>
                            <div className="midfield"><h1>Choose Collateral, Start location, End location and Distance</h1></div>
                            <div className="nyReward"><label>Reward: </label></div>
                            <div className="Reward"><label type="label" />{labelText}</div>
                            <div className="nyCollateral"><label><br />Collateral: </label></div>
                            <div className="Collateral"><input type="number" name={'Collateral'} /></div>
                            <div className="nyDistance"><label>Distance(in SU): </label></div>
                            <div className="Distance"><input type="number" name={'Distance'} /></div>
                            <div className="nyDistanceKM"><label>Atmospheric Distance(in KM):<br />Only use if Type is Planet. </label></div>
                            <div className="DistanceKM"><input type="number" name={'DistanceKM'} /></div>
                            <div className="sub1"><input type="submit" value="Check Reward" onClick={checkReward} /></div>
                            <div className="nyStart Location"><label><br /><br />Start Location: </label></div>
                            <div className="Start Location"><input type="text" name={'Start Location'} /></div>
                            <div className="nyEnd location"><label>End location: </label></div>
                            <div className="End location"><input type="textarea" name={'End location'} /></div>
                            <div className="nyUsername"><label><br /><br />Username: </label></div>
                            <div className="Username"><input type="textarea" name={'Username'} /><br /></div>
                            <div className="sub2"><input type="submit" value="Create Contract" onClick={createContract} /></div>

                        </form>
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

export default ContentCalculator;