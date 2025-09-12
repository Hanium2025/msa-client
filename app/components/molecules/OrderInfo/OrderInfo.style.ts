import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    padding: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0, 0, 0, 0.10)",
    backgroundColor: "#FFF",
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    // Android
    elevation: 6,
  },

  content: {
    display: "flex",
    width: 290,
    height: 189,
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },

  title: {
    alignSelf: "stretch",
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  productContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
  },

  imageGrid: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
    aspectRatio: 1,
  },

  productDetails: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
  },

  productName: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 22,
    alignSelf: "stretch",
  },

  sellerName: {
    alignSelf: "stretch",
    color: "#9C9C9C",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 22,
  },

  priceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },

  priceDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  priceDetailsLabel: {
    width: 60,
    color: "#000",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  priceDetailsValue: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    color: "#000",
    textAlign: "right",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  totalPriceLabel: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  totalPriceValue: {
    color: "#000",
    textAlign: "right",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.32,
  },
});
