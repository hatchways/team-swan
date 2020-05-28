import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import withAuth from "common/withAuth";

// A Route that responds when OAuth redirects the user back to our application

const Auth = (props) => {

    React.useEffect(() => {
        const value = queryString.parse(props.location.search)
        const checkAuth = async () => {
            const res = await axios.post('/gmail/token', { code: value.code })
            if (res.data.message) {
                props.history.push("/")
            }
        }
        checkAuth()
    }, [props.history, props.location.search])

    return (
        <div>
            {props.history.push("/")}
        </div>
    )

}

export default withAuth(Auth)