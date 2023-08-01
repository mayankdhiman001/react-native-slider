import { StyleSheet, View, TextInput, Text } from "react-native";
import React from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useAnimatedProps,
  runOnJS,
} from "react-native-reanimated";
import Fonts from "../constants/Fonts";
import { MultiSelect } from "react-native-element-dropdown";
const CustomSlider = ({
  sliderWidth,
  min,
  max,
  step,
  onValueChange,
  multiSelect,
  style,
}) => {
  const position = useSharedValue(0);
  const position2 = useSharedValue(sliderWidth);
  const opacity = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const zIndex2 = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = position.value;
    },
    onActive: (e, ctx) => {
      opacity.value = 1;
      if (ctx.startX + e.translationX < 0) {
        position.value = 0;
      } else if (ctx.startX + e.translationX > position2.value) {
        position.value = position2.value;
        zIndex.value = 1;
        zIndex2.value = 0;
      } else {
        position.value = ctx.startX + e.translationX;
      }
    },
    onEnd: () => {
      opacity.value = 0;
      runOnJS(onValueChange)({
        min:
          min +
          Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
            step,
        max:
          min +
          Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
            step,
      });
    },
  });

  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = position2.value;
    },
    onActive: (e, ctx) => {
      opacity2.value = 1;
      if (ctx.startX + e.translationX > sliderWidth) {
        position2.value = sliderWidth;
      } else if (ctx.startX + e.translationX < position.value) {
        position2.value = position.value;
        zIndex.value = 0;
        zIndex2.value = 1;
      } else {
        position2.value = ctx.startX + e.translationX;
      }
    },
    onEnd: () => {
      opacity2.value = 0;
      runOnJS(onValueChange)({
        min:
          min +
          Math.floor(position.value / (sliderWidth / ((max - min) / step))) *
            step,
        max:
          min +
          Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
            step,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: zIndex.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: position2.value }],
    zIndex: zIndex2.value,
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const opacityStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    width: position2.value - position.value,
  }));

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  const minLabelText = useAnimatedProps(() => {
    return {
      text: `${
        min +
        Math.floor(position.value / (sliderWidth / ((max - min) / step))) * step
      }`,
    };
  });
  const maxLabelText = useAnimatedProps(() => {
    return {
      text: `${
        min +
        Math.floor(position2.value / (sliderWidth / ((max - min) / step))) *
          step
      }`,
    };
  });
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 7,
      }}
    >
      <Text
        style={{
          justifyContent: "center",
          fontSize: 15,
          alignSelf: "flex-start",
          marginLeft: 5,
        }}
      >
        {min}
      </Text>
      <View style={[styles.sliderContainer, { width: sliderWidth }, style]}>
        <View
          style={[
            styles.sliderBack,
            {
              width: sliderWidth,
              backgroundColor: multiSelect ? "#DFEAFB" : "#D32F2F",
            },
          ]}
        />

        <Animated.View
          style={[
            sliderStyle,
            styles.sliderFront,
            { backgroundColor: multiSelect ? "#D32F2F" : "#DFEAFB" },
          ]}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              animatedStyle,
              styles.thumb,
              {
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Animated.Text
              style={{
                fontSize: 11,
                color: "#ffffff",
                fontFamily: Fonts.FONT_MEDIUM,
              }}
            >{`${
              min +
              Math.floor(
                position.value / (sliderWidth / ((max - min) / step))
              ) *
                step
            }`}</Animated.Text>
            <Animated.View style={[opacityStyle, styles.label]}>
              <AnimatedTextInput
                style={styles.labelText}
                animatedProps={minLabelText}
                editable={false}
                defaultValue={"0"}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        {multiSelect ? (
          <PanGestureHandler onGestureEvent={gestureHandler2}>
            <Animated.View
              style={[
                animatedStyle2,
                styles.thumb,
                {
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <AnimatedText
                style={{
                  fontSize: 11,
                  color: "#ffffff",
                  fontFamily: Fonts.FONT_MEDIUM,
                }}
              >{`${
                min +
                Math.floor(
                  position2.value / (sliderWidth / ((max - min) / step))
                ) *
                  step
              }`}</AnimatedText>
              <Animated.View style={[opacityStyle2, styles.label]}>
                <AnimatedTextInput
                  style={styles.labelText}
                  animatedProps={maxLabelText}
                  editable={false}
                  defaultValue={"0"}
                />
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        ) : null}
      </View>
      <Text
        style={{
          justifyContent: "center",
          fontSize: 15,
          alignSelf: "flex-start",
          marginRight: 5,
        }}
      >
        {max}
      </Text>
    </View>
  );
};

export default CustomSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 9,
  },
  sliderBack: {
    height: 6,
    borderWidth: 0,

    borderRadius: 20,
  },
  sliderFront: {
    height: 6,
    borderWidth: 0,

  

    borderRadius: 20,
    position: "absolute",
  },
  thumb: {
    left: -10,
    width: 20,
    height: 20,
    position: "absolute",
    backgroundColor: "#D32F2F",
    borderColor: "#D32F2F",
 
    borderRadius: 10,
  },
  label: {
    position: "absolute",
    top: -40,
    bottom: 20,
    backgroundColor: "black",
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    color: "white",
    padding: 5,
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
  },
});
