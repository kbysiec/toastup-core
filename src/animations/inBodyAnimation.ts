import { InBodyAnimation, animationType } from "..";

import "./inBodyAnimation.scss";

export const zoomInBody: InBodyAnimation = {
  type: animationType.body,
  animationName: "zoom-in-body",
  animationTime: 500,
};

export const slideHorizontalWithFadeInBody: InBodyAnimation = {
  type: animationType.body,
  animationName: "slide-horizontal-with-fade-in-body",
  animationTime: 250,
};

export const slideVerticallyWithFadeInBody: InBodyAnimation = {
  type: animationType.body,
  animationName: "slide-vertically-in-body",
  animationTime: 250,
};
