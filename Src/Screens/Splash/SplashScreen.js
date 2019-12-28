import React from 'react';
import { View, Image } from 'react-native';

class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('Loading');
    }
  }

  render() {
    return (
      <View style={styles.viewStyles}>
        <Image source={require('./OIT!.png')} style={styles.imageStyles}/>
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8DBF8B'
  },
  imageStyles: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200
  }
}

export default SplashScreen;