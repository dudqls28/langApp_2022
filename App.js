import React,{useRef,useState} from 'react';
import styled from "styled-components/native";
import { Animated, Easing,PanResponder, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PushNotificationIOS } from 'react-native';
import icons from "./icons";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex:1;
  background-color:${BLACK_COLOR};
`;
const Edge = styled.View`
  flex:1
  justify-content : center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  background-color:${GREY};
  width:100px;
  height:100px;
  justify-content : center;
  align-items: center;
  border-radius: 50px;
`;

const Word = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.color};
`;

const Center = styled.View`
  flex:3;
  justify-content : center;
  align-items: center;
  z-index: 10;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color:white;
  padding: 10px 20px;
  border-radius: 10px;
  z-index: 10;
  position: absolute;
`;

export default function App() {
  //values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({x:0,y:0})).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });
  //Animation
  const onPressIn = 
    Animated.spring(scale,{ toValue:0.95, useNativeDriver:true});
  
  const onPressOut = 
    Animated.spring(scale,{ toValue:1, useNativeDriver:true});
  
  const goCenter = 
    Animated.spring(position,{ toValue:0, useNativeDriver:true});

  const goLeft = 
    Animated.spring(position,{ toValue:-500,tension:5, restDisplacementThreshold:100,restSpeedThreshold:100,useNativeDriver:true});
  
  const goRight = 
    Animated.spring(position,{ toValue:500,tension:5, restDisplacementThreshold:100,restSpeedThreshold:100,useNativeDriver:true});
    const onDropScale = Animated.timing(scale, {
      toValue: 0,
      duration: 50,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    const onDropOpacity = Animated.timing(opacity, {
      toValue: 0,
      duration: 50,
      easing: Easing.linear,
      useNativeDriver: true,
    });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove : (_,{dx,dy}) => {
        position.setValue({x:dx,y:dy});
      },
      onPanResponderRelease: (_,{dx,dy}) =>{
        if (dy < -250 || dy > 250) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              duration: 50,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      }
    })
  ).current;
  //state
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>I Know</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(),{ scale }],
          }}
        >
          <Ionicons name={icons[index]} color={GREY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED} >I Don't Know</Word>
        </WordContainer>
      </Edge>
    </Container>
  )
}

