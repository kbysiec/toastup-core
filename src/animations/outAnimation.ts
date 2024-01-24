import { OutAnimation, animationType } from "..";

import "./outAnimation.scss";

export const fadeOut: OutAnimation = {
  type: animationType.out,
  animationName: "fade-out",
  animationTime: 500,
};

export const zoomOut: OutAnimation = {
  type: animationType.out,
  animationName: "zoom-out",
  animationTime: 500,
};

export const zoomWithBounceOut: OutAnimation = {
  type: animationType.out,
  animationName: "zoom-with-bounce-out",
  animationTime: 500,
};

export const slideVerticallyOut: OutAnimation = {
  type: animationType.out,
  animationName: "slide-vertically-out",
  animationTime: 500,
};

export const slideHorizontallyOut: OutAnimation = {
  type: animationType.out,
  animationName: "slide-horizontally-out",
  animationTime: 500,
};

export const bounceHorizontallyOut: OutAnimation = {
  type: animationType.out,
  animationName: "bounce-horizontally-out",
  animationTime: 500,
};

export const singleBounceHorizontallyOut: OutAnimation = {
  type: animationType.out,
  animationName: "single-bounce-horizontally-out",
  animationTime: 500,
};

export const flipXOut: OutAnimation = {
  type: animationType.out,
  className: "animate__animated animate__flipOutX",
  animationTime: 500,
};

export const singleBounceVerticallyOut: OutAnimation = {
  type: animationType.out,
  animationName: "single-bounce-vertically-out",
  animationTime: 500,
};
