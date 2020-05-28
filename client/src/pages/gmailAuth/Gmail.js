import React, { useState, useEffect } from 'react'
import axios from 'axios'
import withAuth from "common/withAuth";
import { Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    button: {
        position: "absolute",
        bottom: '1rem',
        left: '1rem'
    }
})

const GmailLogin = (props) => {

    const classes = useStyles()

    const [isGmailAuthorized, setGmailAuthorized] = React.useState(false)

    React.useEffect(() => {
        const checkAuthorized = async () => {
            const hasGmailAuthorized = (await (axios.get('/gmail/authenticated'))).data.message
            console.log(hasGmailAuthorized)
            setGmailAuthorized(hasGmailAuthorized)
        }
        checkAuthorized()
    }, [props.user])

    const handleClick = async () => {

        const response = await axios.get('/gmail/authurl')

        const route = response.data.route

        console.log(route)
        return window.location = route
    }

    return (
        <div>
            {!isGmailAuthorized && (
                <div className={classes.button} >
                    <Button variant="contained" color="primary" onClick={handleClick}>
                        Authorize Gmail
                    </Button>
                </div>
            )
            }
        </div>
    )

}

export default withAuth(GmailLogin)