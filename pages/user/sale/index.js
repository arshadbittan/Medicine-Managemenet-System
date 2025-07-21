import classes from './sale.module.css';
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
import { columns_sale } from '../../../Components/DataTabel/Sales/Column';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Sales = () => {
  const router = useRouter();
  const [medicineData, setMedicineData] = useState([]);
  const { state, dispatch } = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          dispatch({ type: 'open popup', payload: { msg: 'User not logged in.', type: 'error' } });
          return;
        }

        const response = await axios.post('/api/Medicine/fetch', { uid: user.uid });
        setMedicineData(response.data.sales || []);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        dispatch({ type: 'open popup', payload: { msg: 'Failed to fetch sales data.', type: 'error' } });
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>MedAssist | Sales</title>
      </Head>

      <div className={classes.main_container}>
        <Navbar title="Sales" />

        <div className={classes.dataTabelContainer}>
          <div className={classes.input_container}>
            <div className={classes.btn}>
              <Button
                startIcon={<RemoveCircleIcon />}
                fullWidth
                variant="contained"
                color="error"
                onClick={() => router.replace('/user/sale-medicine')}
              >
                Sale
              </Button>
            </div>
          </div>

          {loading ? (
            <p style={{ opacity: 0.6 }}>Loading sales data...</p>
          ) : medicineData.length > 0 ? (
            <DataTable data={medicineData} col={columns_sale} />
          ) : (
            <>
              <h2 style={{ opacity: 0.5 }}>You haven't sold any medicine yet.</h2>
              <span style={{ opacity: 0.5, fontWeight: 500 }}>
                Click here to sell medicine –{' '}
                <a href="/user/sale-medicine" style={{ color: 'blue' }}>
                  sell medicine
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

export default Sales;
