import classes from './history.module.css';
import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Navbar from '../../../Components/subNavbar/navbar';
import axios from 'axios';
import { auth } from '../../../firebase/firebase';
import HistoryTable from '../../../Components/HistoryTable/HistoryTable';
import { StateContext } from '../../../Context/StateContext';

function History() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dispatch } = useContext(StateContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError("User not logged in.");
                    setLoading(false);
                    return;
                }

                const res = await axios.post('/api/Medicine/fetch', { uid: user.uid });
                const { history } = res.data;
                setData(history || []);
                dispatch({ type: 'reset history badger' });
            } catch (err) {
                setError("Failed to fetch history.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [dispatch]);

    return (
        <>
            <Head>
                <title>MedAssist | History</title>
            </Head>
            <Navbar title="History" />
            <div className={classes.main_container}>
                {loading ? (
                    <h2 style={{ opacity: 0.5 }}>Loading...</h2>
                ) : error ? (
                    <h2 style={{ opacity: 0.5 }}>{error}</h2>
                ) : data.length > 0 ? (
                    <HistoryTable rows={data} />
                ) : (
                    <h2 style={{ opacity: 0.5 }}>No history recorded.</h2>
                )}
            </div>
        </>
    );
}

export default History;
