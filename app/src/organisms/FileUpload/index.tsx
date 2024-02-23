import { forwardRef, useState } from "react";
import { Link } from "@mui/material";
import { AttachFileRounded } from "@mui/icons-material";
import MDBox from "atoms/MDBox";
import MDButton from "atoms/MDButton";
import MDTypography from "atoms/MDTypography";
import ListFileTooltip from "organisms/ListFileTooltip";
import { TFileUpload } from "./types";
import { inputFileStyle } from "./styles";

const FileUpload = forwardRef<HTMLInputElement, TFileUpload>(
  (
    {
      name,
      localFiles,
      remoteFiles,
      multiple,
      accept,
      formikProps,
      showRemoteFiles,
      onChange,
      onDelete,
    },
    ref
  ) => {
    const [showLocalFile, setShowLocalFile] = useState(false);
    const [showRemoteFile, setShowRemoteFile] = useState(false);

    const onShowLocalFile = () => {
      setShowLocalFile(true);
    };

    const onCloseLocalFile = () => {
      setShowLocalFile(false);
    };

    const onShowRemoteFile = () => {
      setShowRemoteFile(true);
    };

    const onCloseRemoteFile = () => {
      setShowRemoteFile(false);
    };

    return (
      <MDBox>
        {showRemoteFiles ? (
          <ListFileTooltip
            formikProps={formikProps}
            open={showRemoteFile}
            files={remoteFiles}
            onClose={onCloseRemoteFile}
            onDelete={onDelete}
            messageEmptyFiles="No uploaded file's"
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link component="button" onClick={onShowRemoteFile} variant="caption" type="button">
              (
              <MDTypography
                variant="caption"
                component="small"
                fontWeight="regular"
                color="text"
                sx={{ textDecoration: "underline" }}
              >
                {remoteFiles.length} file&apos;s uploaded
              </MDTypography>
              )
            </Link>
          </ListFileTooltip>
        ) : null}
        {"  "}
        <ListFileTooltip
          formikProps={formikProps}
          open={showLocalFile}
          files={localFiles}
          onClose={onCloseLocalFile}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link component="button" onClick={onShowLocalFile} variant="caption" type="button">
            (
            <MDTypography
              variant="caption"
              component="small"
              fontWeight="regular"
              color="text"
              sx={{ textDecoration: "underline" }}
            >
              {localFiles.length} file&apos;s
            </MDTypography>
            )
          </Link>
        </ListFileTooltip>
        {"  "}
        <MDButton
          sx={{ padding: "0.5rem" }}
          variant="contained"
          color="info"
          component="label"
          startIcon={<AttachFileRounded />}
        >
          Upload{" "}
          <input
            ref={ref}
            style={inputFileStyle()}
            type="file"
            name={name}
            multiple={multiple}
            accept={accept}
            onChange={(e) => onChange(e, formikProps.setFieldValue)}
          />
        </MDButton>
      </MDBox>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
