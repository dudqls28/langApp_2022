import React,{useRef,useState} from 'react';
import styled from "styled-components/native";
import { Animated, PanResponder } from "react-native";

const Container = styled.View`
  flex:1;
  justify-content : center;
  align-items: center;
`;

const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);
export default function App() {
  const [up,setUp] = useState(false);
  const POSITION = useRef(new Animated.ValueXY({x:0,y:0})).current;
  const toggleUp = () => setUp((prev) => !prev);
  const moveUp = () => {
    Animated.timing(POSITION,{
      toValue: up ? 300 : -300,
      duration:1000,
      useNativeDriver:false,
    }).start(toggleUp);
  };
  /*const opacity = POSITION.y.interpolate({
    inputRange: [-300,0,300],
    outputRange : [1,0.5,1],
  });*/
  const rotation = POSITION.y.interpolate({
    inputRange:[-300,300],
    outputRange:["-540deg","540deg"],
  });
  const bgColor = POSITION.y.interpolate({
    inputRange:[-300,300],
    outputRange:["rgb(255,99,71)","rgb(73,152,223)"],
  })
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300,300],
    outputRange : [100,0],
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove : (_,{dx,dy}) => {
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      }
    })
  ).current;
  return (
    <Container>
        <AnimatedBox 
          {...panResponder.panHandlers}
          style={{
            borderRadius,
            backgroundColor: bgColor,
            transform: [...POSITION.getTranslateTransform()],
          }}
        />
    </Container>
  )
}

