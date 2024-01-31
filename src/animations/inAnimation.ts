// import "animate.css";
import { animationType } from "@/constants";
import { InAnimation } from "@/types";
import "./inAnimation.scss";

export const fadeIn: InAnimation = {
  type: animationType.in,
  animationName: "fade-in",
  animationTime: 500,
};

export const zoomIn: InAnimation = {
  type: animationType.in,
  animationName: "zoom-in",
  animationTime: 500,
};

export const zoomWithBounceIn: InAnimation = {
  type: animationType.in,
  animationName: "zoom-with-bounce-in",
  animationTime: 500,
};

export const slideVerticallyIn: InAnimation = {
  type: animationType.in,
  animationName: "slide-vertically-in",
  animationTime: 500,
};

export const slideHorizontallyIn: InAnimation = {
  type: animationType.in,
  animationName: "slide-horizontally-in",
  animationTime: 500,
};

export const bounceHorizontallyIn: InAnimation = {
  type: animationType.in,
  animationName: "bounce-horizontally-in",
  animationTime: 500,
};

export const singleBounceHorizontallyIn: InAnimation = {
  type: animationType.in,
  animationName: "single-bounce-horizontally-in",
  animationTime: 500,
};

export const flipXIn: InAnimation = {
  type: animationType.in,
  className: "animate__animated animate__flipInX",
  animationTime: 500,
};

export const singleBounceVerticallyIn: InAnimation = {
  type: animationType.in,
  animationName: "single-bounce-vertically-in",
  animationTime: 500,
};
