import MDTypography from "atoms/MDTypography";
import MDButton from "atoms/MDButton";
import { ClickAwayListener, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TListFileTooltip } from "./types";
import { toolTipStyle } from "./styles";

function ListFileTooltip({
  open,
  children,
  files,
  formikProps,
  messageEmptyFiles = "No choosen file",
  onClose,
  onDelete,
}: TListFileTooltip) {
  const renderlistFiles = () => {
    const listFiles = [];

    files.forEach((listFile) => {
      let fileName = "";
      if (listFile instanceof File) {
        fileName = listFile.name;
      } else {
        fileName = listFile;
      }

      listFiles.push(
        <MDTypography key={fileName} variant="caption" component="div" color="light" mb={0.3}>
          {onDelete ? (
            <div className="overlay-remove-file">
              <MDButton
                iconOnly
                size="medium"
                variant="text"
                sx={{ height: "inherit", minHeight: "inherit", padding: 0 }}
                title="Delete"
                onClick={() => onDelete(listFile, formikProps.setValues)}
              >
                <DeleteIcon color="error" fontSize="large" />
              </MDButton>
            </div>
          ) : null}

          {fileName.toLowerCase()}
        </MDTypography>
      );
    });

    return listFiles;
  };

  return files?.length ? (
    <ClickAwayListener onClickAway={onClose}>
      <div style={{ display: "inline-block" }}>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={onClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={renderlistFiles()}
          placement="bottom-start"
          slotProps={{
            tooltip: {
              sx: toolTipStyle(),
            },
          }}
        >
          {children}
        </Tooltip>
      </div>
    </ClickAwayListener>
  ) : (
    <MDTypography variant="caption" component="small" fontWeight="regular" color="text">
      ({messageEmptyFiles})
    </MDTypography>
  );
}

export default ListFileTooltip;
