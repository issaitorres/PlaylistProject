import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useRandomInterval, range, usePrefersReducedMotion, random } from "../../helper/SparkleHelperMethods"
import "./sparkles.css"


const comeInOut = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;
const Wrapper = styled.span`
  display: inline-block;
  position: relative;
  margin: 0px;
`;
const SparkleWrapper = styled.span`
  position: absolute;
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${comeInOut} 700ms forwards;
  }
`;
const SparkleSvg = styled.svg`
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} 1000ms linear;
  }
`;
const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
  font-weight: bold;
`;


const generateSparkle = () => {
  const sparkleColors = [
    "#2cacf3",
    "#fee13f",
    "#d23428",
    "#9327c6",
    "#0ee35c",
    "#ff9429",
    "#ff2ece"
  ]
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color: sparkleColors[Math.floor(Math.random()*sparkleColors.length)],
    size: random(10, 30),
    style: {
      top: random(0, 100) + '%',
      left: random(0, 100) + '%',
      zIndex: random(1,3)
    },
  };
  return sparkle;
};

const Sparkle = ({ size, color, style }) => {
  const blurAmount = [0,0,0,0,0,2,4,6,8,10]
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
  return (
    <SparkleWrapper style={style}>
      <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <defs>
          <filter id="f1" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount[Math.floor(Math.random()*blurAmount.length)]} />
          </filter>
        </defs>
        <path d={path} fill={color} filter="url(#f1)" />
      </SparkleSvg>
    </SparkleWrapper>
  );
};

const Sparkles = ({ children, activate, ...delegated }) => {
  const [sparkles, setSparkles] = useState(() => {
    return range(3).map(() => generateSparkle());
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  useRandomInterval(
    () => {
      if (activate) {
        const sparkle = generateSparkle();
        const now = Date.now();
        const nextSparkles = sparkles.filter(sp => {
          const delta = now - sp.createdAt;
          return delta < 750;
        });
        nextSparkles.push(sparkle);
        setSparkles(nextSparkles);
      }
    },
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 450
  );

  return (
    <>
      <Wrapper {...delegated}>
        {sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            size={sparkle.size}
            color={sparkle.color}
            style={sparkle.style}
          />
        ))}
        <ChildWrapper>{children}</ChildWrapper>
      </Wrapper>
    </>
  );
};


export default Sparkles;
