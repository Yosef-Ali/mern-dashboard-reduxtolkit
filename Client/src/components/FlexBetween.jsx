import { Box, styled } from "@mui/material";

const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "@media (min-width: 600px)": {
    flexWrap: "wrap",
    gap: "16px",
  },
});

export default FlexBetween;
