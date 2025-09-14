// app/components/organisms/PaymentWidget.tsx
import { Platform } from "react-native";

let Comp: any;
if (Platform.OS === "web") {
  Comp = require("./PaymentWidget.web").default;
} else {
  Comp = require("./PaymentWidget.native").default;
}

export default Comp;