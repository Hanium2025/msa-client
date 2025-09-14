import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

type Direction = "down" | "up" | "left" | "right";

type Props = SvgProps & {
  size?: number;
  color?: string;
  direction?: Direction;
};

export default function DropdownArrow({
  size,
  color = "#1D1B20",
  direction = "down",
  ...props
}: Props) {
  const width = size ?? (props.width as number) ?? 22;
  const height = size ? (size * 23) / 22 : ((props.height as number) ?? 23);

  const angle =
    direction === "up"
      ? 180
      : direction === "left"
        ? 90
        : direction === "right"
          ? -90
          : 0;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 22 23"
      fill="none"
      {...props}
    >
      <Path
        d="M10.9998 14.25L6.4165 9.66667H15.5832L10.9998 14.25Z"
        fill={color}
        transform={`rotate(${angle} 11 11.5)`}
      />
    </Svg>
  );
}
