import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MDBox from "atoms/MDBox";
import { useMaterialUIController, setLayout } from "context";
import { IPageLayout } from "./types";

function PageLayout({ background, children }: IPageLayout) {
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "page");
  }, [pathname]);

  return (
    <MDBox
      width="100vw"
      height="100%"
      minHeight="100vh"
      bgColor={background}
      sx={{ overflowX: "hidden" }}
    >
      {children}
    </MDBox>
  );
}

PageLayout.defaultProps = {
  background: "default",
};

export default PageLayout;
