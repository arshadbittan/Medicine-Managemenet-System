import classes from './items.module.css';
import Navbar from "../../../Components/subNavbar/navbar";
import Head from 'next/head';
import DataTable from '../../../Components/DataTabel/DataTabel';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { auth } from '../../../firebase/firebase';

import { StateContext } from '../../../Context/StateContext';
import SnackbarTag from '../../../Components/Snackbar/Snackbar';
import { columns } from '../../../Components/DataTabel/Items/Column';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const Items = () => {
    const router = useRouter();
    const [medicineData, setMedicineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useContext(StateContext);

    useEffect(() => {
        const fetchMedicineData = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    router.replace('/login'); // redirect if user not logged in
                    return;
                }

                const res = await axios.post('/api/Medicine/fetch', { uid: user.uid });
                setMedicineData(res.data.stock || []);
            } catch (error) {
                console.error("Error fetching medicine data:", error);
                dispatch({
                    type: 'open popup',
                    payload: {
                        msg: "Failed to load medicines.",
                        type: "error"
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMedicineData();
    }, [router, dispatch]);

    return (
        <>
            <Head>
                <title>MedAssist | Items</title>
            </Head>
            <div className={classes.main_container}>
                <Navbar title="Items" />
                <div className={classes.dataTabelContainer}>
                    <div className={classes.input_container}>
                        <div className={classes.btn}>
                            <Button
                                startIcon={<DeleteIcon />}
                                fullWidth={true}
                                variant="contained"
                                color="error"
                                onClick={() => router.replace('/user/remove-medicine')}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : medicineData.length !== 0 ? (
                        <DataTable data={medicineData} col={columns} />
                    ) : (
                        <>
                            <h2 style={{ opacity: ".5" }}>
                                You haven't added any medicine yet.
                            </h2>
                            <span style={{ opacity: '.5', fontWeight: '500' }}>
                                Click here to add medicine -{' '}
                                <a href='/user/purchase-medicine' style={{ color: 'blue' }}>
                                    Purchase medicine
                                </a>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <SnackbarTag
                open={state.isPopUpOpen}
                msg={state.popupMsg}
                type={state.popupType}
                close={(reason) => {
                    if (reason === 'clickaway') return;
                    dispatch({ type: 'close popup' });
                }}
            />
        </>
    );
};

export default Items;
