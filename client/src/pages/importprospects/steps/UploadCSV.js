import React from "react";
import Dropzone from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import useSnackBar from "common/useSnackbar";

const useStyles = makeStyles({
  root: {
    borderRadius: 1,
    backgroundColor: "rgba(255, 255, 255,0.8)",
    height: "6rem;",
    lineHeight: "6rem;",
    padding: "0 30px",
    border: "1px dashed black",
    strokeDasharray: 10,
  },
  inner: {
    textAlign: "center",
  },
});

export default (props) => {
  const classes = useStyles();
  const showSnackbar = useSnackBar();

  return (
    <div className="">
      <Dropzone
        maxSize={5e6}
        accept=".csv"
        onDrop={async (acceptedFiles, rejectedFiles) => {
          if (Array.isArray(rejectedFiles) && rejectedFiles.length > 0) {
            if (rejectedFiles[0].file.size > 5e6) {
              showSnackbar("File size too big. Max file size is 5MB!", "error");
            } else {
              showSnackbar("Invalid file", "error");
            }
          }
          await props.setFile(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} className={classes.root}>
              <div>
                <input {...getInputProps()} />
                <div className={classes.inner}>
                  <div>Drag 'n' drop csv files here</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};
