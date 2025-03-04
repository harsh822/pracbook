import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "auto",
    maxWidth: "270px",
    height: "300px",
    minWidth: "250px",
    margin: "25px",
    position: "relative",
    // cursor: "pointer",
    boxShadow: "0px 0px 7px 0px rgba(0,0,0,0.2)",
  },
  text: {
    marginTop: "5px !important",
  },
  icon: {
    position: "absolute",
    right: "0px",
    marginTop: "12px !important",
    marginRight: "6px !important",
    color: "white",
  },
  mediaHead: {
    position: "absolute",
    color: "white",
    padding: "15px",
    fontSize: "18px",
    textTransform: "capitalize",
  },
}));

const SectionCard = ({ props }) => {
  const classNames = useStyles();

  return (
    <Card className={classNames.card}>
      <Typography className={classNames.mediaHead}>
        {props.data.subject}
      </Typography>
      <CardMedia
        component="img"
        height="40%"
        image="https://gstatic.com/classroom/themes/img_graduation.jpg"
        alt="section k"
      />
      <CardContent>
        <Typography variant="body2" className={classNames.text}>
          <b>Exam Type :</b> {props.data.name}
        </Typography>
        <Typography variant="body2" className={classNames.text}>
          <b>Date :</b> {props.data.date}
        </Typography>
        <Typography variant="body2" className={classNames.text}>
          <b>Time :</b> {props.data.time}
        </Typography>
        <Typography variant="body2" className={classNames.text}>
          <b>Duration :</b> {`${props.data.duration} min.`}
        </Typography>
        <Typography variant="body2" className={classNames.text}>
          <b>Max Marks :</b> {props.data.marks}
        </Typography>
        <Typography variant="body2" className={classNames.text}>
          <b>Marks Obtained:</b> {props.data.marksObtained}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SectionCard;
