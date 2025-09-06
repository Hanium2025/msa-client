import type { ImageSourcePropType } from "react-native";

export type CategoryItem = {
  slug: string;
  title: string;
  icon: ImageSourcePropType; // PNG
};

export const CATEGORIES: CategoryItem[] = [
  { slug: "TRAVEL", title: "이동·안전장비",      icon: require("../../assets/images/move_safety.png") },
  { slug: "FEEDING",     title: "식사·수유·위생 가전", icon: require("../../assets/images/feeding.png") },
  { slug: "SLEEP",       title: "수면·안전",           icon: require("../../assets/images/sleep.png") },
  { slug: "PLAY",    title: "놀이·교육",          icon: require("../../assets/images/play_edu.png") },
  { slug: "LIVING",      title: "리빙·가구",           icon: require("../../assets/images/living.png") },
  { slug: "APPAREL",     title: "의류·잡화",           icon: require("../../assets/images/apparel.png") },
  { slug: "OTHER",       title: "기타",                icon: require("../../assets/images/_etc.png") },
];
