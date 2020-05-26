import React from 'react';
import { Button } from '@material-ui/core';
import useSnackbar from 'common/useSnackbar'
import axios from 'axios';

export default ({ mappedAttributes, setActiveStep, filename }) => {

    const showSnackbar = useSnackbar()

    const onclick = async () => {
        try {
            const resp = await axios.post('/api/addprospects', { mappedAttributes, filename })
            showSnackbar(resp.data.message, 'success')
            setActiveStep((prevStep) => prevStep + 1)
        } catch (err) {
            showSnackbar(
                err.response && err.response.data.errors ? err.response.data.errors[0].message : "Error!",
                "error"
            );
        }
    }

    return (
        <Button onClick={onclick}>
            Add Prospects
        </Button>
    )
}