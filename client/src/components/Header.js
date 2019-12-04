// Imports - React
import React, { Component } from "react";
import PropTypes from "prop-types";
// Imports - Frameworks (Semantic-UI and Material-UI)
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        flexGrow: 1
    }
});


class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <img className="logo" src="https://i0.wp.com/ankerpay.com/wp-content/uploads/2019/11/cropped-Asset-12.png?fit=342%2C342&amp;ssl=1"  width="40" />
                        <Typography
                            variant="subtitle1"
                            color="inherit"
                        >
                            Enigma Privacy Tools
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
