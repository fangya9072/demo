import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../constant/color';

/*
Top Location Component
provide a list of places for users to switch between
will show after user clicked on the right location icon on Top Banner
*/

class TopLocationMenu extends React.Component {
    // set up state
	constructor(props) {
		super(props);
		this.state = {};
    }
    //rendering
	render(){
        return(
            <Container>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/home.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/work.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/food.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/coffee.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/favourite.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/location-icon/search-location.png')}/>
                    </Button>
                </ButtonArea>
            </Container>
        );
    }
}

export default withNavigation(TopLocationMenu);

// css
const Container = styled.View`
    height: 345px;
    width: 60px;
    position: absolute;;
    left: 315px;
    top: 45px;
    flex-direction: column;
    background-color: rgba(255,255,255,0.85);
    border-radius: 12.5px;
    zIndex: 0;
`
const ButtonArea = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`

const Button = styled.TouchableOpacity`
    width: 42.5px;
    height: 42.5px;
    border-radius: 10px;
    background-color: lightgray;
    align-items: center;
    justify-content: center;
`

const ButtonIcon = styled.Image`
    height: 30px;
    width: 30px;
`