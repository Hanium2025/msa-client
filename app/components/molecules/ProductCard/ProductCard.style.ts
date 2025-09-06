import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: 165,
    marginBottom: 16,
  },

  thumbWrap: {
    width: "100%",     // = 165
    height: 120,       // 고정
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EDEFF3",
  },
  thumb: { width: "100%", height: "100%" },
  thumbPlaceholder: { flex: 1, backgroundColor: "#E3E6EC" },

  infoRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,                 
  },
  title: {
    flex: 1,                
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
    marginRight: 6,         
  },
  price: {
    flexShrink: 0,          
    fontSize: 12,
    fontWeight: "600",
    color: "#0E5C74",
  },

});
