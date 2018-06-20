import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native';
import Weather from './Weather';

const API_KEY = 'ec0f7ac90dd011a94ad7ec453c27f489';

// react native basic concept: no more div, html, 그말은 즉슨
// 우리가 return 할 수 있는 컴포넌트가 정해져 있다는 것
// react native로 앱을 만들 때,항상 local state로 작업할 것!!!
export default class App extends React.Component {
  state = {
    isLoaded : false,
    error : null,
    temperature:null,
    name:null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  } 

  _fetchWeather = (lat, long) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`
    )
      .then(response => response.json())
      .then(json => {
        console.log(json)

        this.setState({
          temperature:json.main.temp,
          name:json.weather[0].main,
          isLoaded : true
        })
      });
  };
  
  render() { 
    // isLoaded안에 있는 값을 원해요
    const { isLoaded, error, temperature, name } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        { isLoaded ? ( 
          <Weather weatherName={name} temp={ Math.ceil(temperature - 273.15) } /> 
          ) : (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Getting the fucking weather</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText : {
    color : 'red',
    backgroundColor: 'transparent',
    marginBottom: 40
  },
  loading: {
    flex:1,
    backgroundColor: '#FDF6AA',
    justifyContent: 'flex-end',
    paddingLeft: 25,
  },
  loadingText : {
    fontSize: 38,
    marginBottom : 24
  }
});
