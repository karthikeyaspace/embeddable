import toast from "react-hot-toast";

const t = (msg: string, type: "success" | "error" | "info") => {
  toast(msg, {
    duration: 3000,
    position: "bottom-right",
    style: {
      backgroundColor: type === "success" ? "#0072f5" : type === "error" ? "#d93036" : "#ff990a",
      color: "white",
      padding: "5px",
      paddingLeft: "15px",
      paddingRight: "15px",
      borderRadius: "5px",
      fontSize: "1rem",
      fontFamily: "sans-serif",
    },
  });
}

export default t;