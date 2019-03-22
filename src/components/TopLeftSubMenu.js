import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';

/*
Top Left Sub Menu Component
composed of two icons: outfit post icon and weather post icon
will show after user clicked on the post icon on expanded Top Left Menu
*/

class TopLeftSubMenu extends React.Component {
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
                        <ButtonText> My Outfit Today</ButtonText>
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonText> How Is The Weather? </ButtonText>
                    </Button>
                </ButtonArea>
            </Container>
        );
    }
}

export default withNavigation(TopLeftSubMenu);

// css
const Container = styled.View`
    height: 65px;
    width: 150px;
    position: absolute;;
    left: 60px;
    top: 0px;
    flex-direction: column;
    background-color: rgba(255,255,255,0.85);
    border-radius: 10px;
    zIndex: 0;
`
const ButtonArea = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
`

const Button = styled.TouchableOpacity`
    height: 22.5px;
    border-radius: 10px;
    background-color: lightblue;
    align-items: center;
    justify-content: center;
`

const ButtonText = styled.Text`
    font-family: Bradley Hand;
    font-size: 15px;
`