import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
// import TopLeftSubMenu from '../components/TopLeftSubMenu';
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
        this.state = {
            topLeftSubMenuVisible: false,
        };
    }

    // function to pass state to parent componnet
    updateParentState(data) {
        this.props.updateParentState(data);
    }

    //rendering
    render() {
        return (
            <Container>
                <ButtonArea>
                    <Button onPress={() => this.setState({ topLeftSubMenuVisible: !this.state.topLeftSubMenuVisible })}>
                        <ButtonIcon source={require('../../assets/icon/function-icon/camera.png')} />
                    </Button>
                </ButtonArea>
                <ButtonArea>
                    <Button>
                        <ButtonIcon source={require('../../assets/icon/function-icon/friend.png')} />
                    </Button>
                </ButtonArea>
                {/* put components with absolute position at the bottom*/}
                {this.state.topLeftSubMenuVisible && <TopLeftSubMenu>
                    <SubButtonArea>
                        <SubButton onPress={() => this.props.navigation.navigate('OutfitPost', {isMainView: false})}>
                            <SubButtonText> My Outfit Today</SubButtonText>
                        </SubButton>
                    </SubButtonArea>
                    <SubButtonArea>
                        <SubButton onPress={() => this.props.navigation.navigate('WeatherPost',  {isMainView: false})}>
                            <SubButtonText> How Is The Weather? </SubButtonText>
                        </SubButton>
                    </SubButtonArea>
                </TopLeftSubMenu>}
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
const TopLeftSubMenu = styled.View`
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
const SubButtonArea = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 5px;
`

const SubButton = styled.TouchableOpacity`
    height: 22.5px;
    border-radius: 10px;
    background-color: lightblue;
    align-items: center;
    justify-content: center;
`

const SubButtonText = styled.Text`
    font-family: Bradley Hand;
    font-size: 15px;
`