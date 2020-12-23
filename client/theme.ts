type Size = string | number | (string & {});

export interface Theme {
  mainColor: string;
  backgroundColor: string;
  confettiColors: string[];
  topBarHeight: Size;
  topBarFontSize: Size;
  bottomNavHeight: Size;
  bodyPadding: Size;
}

const theme: Theme = {
  mainColor: "#b3000c",
  backgroundColor: "#ffe9ea",
  confettiColors: ["#b3000c", "#42692f"],
  topBarHeight: "75px",
  topBarFontSize: "25px",
  bottomNavHeight: "120px",
  bodyPadding: "20px",
};

export default theme;
