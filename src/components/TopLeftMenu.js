import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../constant/color';

/*
Top Left Menu Component
composed of two icons: post icon and friend icon
will show after user clicked on the left menu icon on Top Banner
*/

class TopLeftMenu extends React.Component {

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
                        <ButtonIcon source={require('../../assets/icon/function-icon/camera.png')}/>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/function-icon/friend.png')}/>
                    </Button>
                </ButtonArea>
            </Container>
        );
    }
}

export default withNavigation(TopLeftMenu);

// css
const Container = styled.View`
    height: 120px;
    width: 60px;
    position: absolute;;
    left: 0px;
    top: 64px;
    flex-direction: column;
    background-color: rgba(255,255,255,0.85)
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