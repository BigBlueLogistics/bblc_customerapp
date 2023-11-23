import theme from "assets/theme";
import DashboardLayout from "organisms/LayoutContainers/DashboardLayout";
import selector from "./selector";

function ContentLoader() {
  const { isAuthenticated } = selector();
  const { typography, palette } = theme;

  const loaderMsg = (
    <p
      style={{
        fontFamily: typography.fontFamily,
        fontSize: "1rem",
        fontWeight: 300,
        lineHeight: 1.6,
        letterSpacing: "0.01071em",
        color: palette.dark.main,
      }}
    >
      Please wait, loading...
    </p>
  );

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <div
          style={{
            flex: "1 0 100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loaderMsg}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loaderMsg}
    </div>
  );
}

export default ContentLoader;
