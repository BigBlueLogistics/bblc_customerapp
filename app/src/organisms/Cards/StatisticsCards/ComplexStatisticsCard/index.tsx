import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "atoms/MDBox";
import MDTypography from "atoms/MDTypography";
import { TComplexStatisticsCard } from "./types";

function ComplexStatisticsCard({
  color,
  title,
  count,
  percentage,
  icon,
  image,
}: TComplexStatisticsCard) {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          {icon ? (
            <Icon fontSize="medium" color="inherit">
              {icon}
            </Icon>
          ) : (
            image
          )}
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDTypography
          component="p"
          variant="button"
          color="text"
          display="flex"
          justifyContent="space-between"
        >
          &nbsp;{percentage.label}
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
        </MDTypography>
      </MDBox>
    </Card>
  );
}

ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

export default ComplexStatisticsCard;
