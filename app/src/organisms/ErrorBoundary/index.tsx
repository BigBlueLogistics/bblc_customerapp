import theme from "assets/theme";
import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { bblcLogo } from "assets/images";

function ErrorBoundary({ children }: { children: ReactNode }) {
  const {
    typography: { pxToRem, fontFamily },
    palette: { dark, grey },
  } = theme;

  return (
    <ReactErrorBoundary
      fallback={
        <div
          style={{
            fontFamily,
            fontSize: pxToRem(16),
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <img src={bblcLogo} alt="logo" style={{ transform: "scale(1.2)" }} />
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <h2 style={{ color: dark.main }}>Woops! Something went wrong</h2>
            <p style={{ color: grey["600"], margin: "0 0 8px 0" }}>
              Brace yourself till we get the error fixed.
            </p>
            <p style={{ color: grey["600"], margin: 0 }}>
              You may also refresh the page or try again later.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
