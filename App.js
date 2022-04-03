import React,{useRef,useState} from 'react';
import styled from "styled-components/native";
import { Animated, PanResponder, View } from "react-native";
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
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color:white;
  padding: 10px 20px;
  border-radius: 10px;
`;

export default function App() {
  //values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({x:0,y:0})).current;
  
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
      onPanResponderRelease: (_,{dx}) =>{
          Animated.parallel([onPressOut,goCenter]).start();
        
      }
    })
  ).current;
  return (
    <Container>
      <Edge>
        <WordContainer>
          <Word color={GREEN}>I Know</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            transform: [...position.getTranslateTransform(),{ scale }],
          }}
        >
          <Ionicons name="beer" color={GREY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer>
          <Word color={RED} >I Don't Know</Word>
        </WordContainer>
      </Edge>
    </Container>
  )
}

