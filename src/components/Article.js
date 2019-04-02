import React, {Component} from 'react';
import styled from 'styled-components/native';
import { View, Linking, TouchableOpacity, WebView } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';
import { Modal }  from 'react-native';

export default class Article extends React.Component {
  render() {
    const {
      title,
      description,
      publishedAt,
      urlToImage,
      url
    } = this.props.article;
    const {featuredTitleStyle} = styles;
    const defaultImg =
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';
 
    return (
      <TouchableOpacity
        useforeground
        onPress={() => Linking.openURL(url)}
        // <View>
        // <WebView
        //    //ref={WEBVIEW_REF}
        //    automaticallyAdjustContentInsets={false}
        //    source={{uri: url}}
        //    javaScriptEnabled={true}
        //    domStorageEnabled={true}
        //    decelerationRate="normal"
        //    startInLoadingState={true}
        //    //scalesPageToFit={this.state.scalesPageToFit}
    
       >
        <Card
          featuredTitle={title}
          featuredTitleStyle={featuredTitleStyle}
          image={{
            uri: urlToImage || defaultImg
          }}
         >
          <Text style={{ marginBottom: 10 }}>
            {description || 'Read More..'}
          </Text>
        </Card>

      </TouchableOpacity>
    );
  }
}


const styles = {
  
  featuredTitleStyle: {
    marginHorizontal: 5,
    textShadowColor: '#00000f',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3
  }
};