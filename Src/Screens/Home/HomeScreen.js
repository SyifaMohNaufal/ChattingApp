import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {Database,Auth} from "../config"
import * as firebase from "firebase";
import Contact from './Contact'
export default class HomeScreen extends React.Component {

    state = {
        email: "",
        name: ""
    };

    componentDidMount() {
        const { email, name } = firebase.auth().currentUser;

        this.setState({ email, name });
    }

    render() {
        return (
            <Contact navigation={this.props.navigation}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
