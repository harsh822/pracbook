import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import { scheduleExam } from "../../api/exam.api";
import { fetchCardDetails } from "../../api/utilities.api";
import { useDispatch } from "react-redux";
import { loadExams } from "../../redux/actions/code.action";
import { getUser } from "../../redux/selectors/code.selector";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  form: {
    padding: "30px !important",
  },
  elements: {
    marginLeft: "25px !important",
  },
}));

const exams = [
  {
    value: "midterm",
    label: "Mid term",
  },
  {
    value: "endterm",
    label: "End Term",
  },
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ScheduleExam({ handleClose }) {
  const classes = useStyles();
  const facultyData = useSelector(getUser);
  const [curYear, setCurYear] = React.useState([]);
  const [sectionList, setSectionList] = React.useState([]);
  const [subjectList, setSubjectList] = React.useState([]);
  const [curSubjectList, setCurSubjectList] = React.useState([]);
  React.useEffect(() => {
    let sectionArray = [];
    let yearArray = [];
    let secLen = facultyData.sections.length;
    let subjectArray = [];
    for (let i = 0; i < secLen; i++) {
      yearArray.push(facultyData.sections[i].year);
      sectionArray.push(facultyData.sections[i].sectionName);
      subjectArray.push(facultyData.sections[i]);
    }
    setCurYear(yearArray);
    setSubjectList(subjectArray);
    setSectionList(sectionArray);
  }, [facultyData]);

  const dispatch = useDispatch();
  const [date, setDate] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [data, setData] = React.useState({
    name: "",
    date: "",
    duration: "",
    year: "",
    subject: "",
    marks: "",
    section: "",
    objMarks: "",
    codingMarks: "",
    time: "",
    objectCount: "",
    codingCount: "",
    completed: false,
  });
  const calcTime = (exams, res) => {
    for (let i = 0; i < res.length; i++) {
      let date = new Date();
      let examDate =
        res[i].date.split("/")[2] +
        "-" +
        res[i].date.split("/")[0] +
        "-" +
        (parseInt(res[i].date.split("/")[1]) < 10
          ? `0${res[i].date.split("/")[1]}`
          : res[i].date.split("/")[1]) +
        "T";
      let hours = res[i].time.split(":")[0];
      if (res[i].time.split(" ")[1] === "PM")
        hours = (parseInt(res[i].time.split(":")[0]) + 12).toString();
      let time = hours + ":" + res[i].time.split(" ")[0].split(":")[1] + ":00";
      let matcher = examDate + time;
      matcher = new Date(new Date(matcher).getTime() + res[i].duration * 60000);
      if (matcher > date) {
        exams.push(res[i]);
      }
    }
    return exams;
  };

  const handleScheduleExam = () => {
    scheduleExam(data).then(() => {
      fetchCardDetails(facultyData._id, "faculty").then((res) => {
        let curExams = [];
        res.exams.forEach((data) => {
          dispatch(loadExams(calcTime(curExams, data)));
        });
      });
    });
    handleClose();
  };

  const handleChange = (props) => (event) => {
    if (props === "time") {
      let time = event.toLocaleString().split(", ")[1];
      time = time.slice(0, time.length - 6) + time.slice(time.length - 3);
      setData({
        ...data,
        time: time,
      });
      setTime(event);
    } else if (props === "date") {
      setData({
        ...data,
        date: event.toLocaleString().split(",")[0],
      });
      setDate(event);
    } else if (props === "section") {
      setData({ ...data, [props]: event.target.value });
      subjectList.forEach((curSection) => {
        if (curSection.sectionName === event.target.value) {
          setCurSubjectList(curSection.subjects);
        }
      });
    } else if (props === "year") {
      setData({ ...data, [props]: event.target.value });
      let curSectionList = [];
      subjectList.forEach((curSection) => {
        if (curSection.year === event.target.value) {
          curSectionList.push(curSection.sectionName);
        }
      });
      setSectionList([...curSectionList]);
    } else setData({ ...data, [props]: event.target.value });
  };
  return (
    <div>
      <Dialog
        className={classes.dialog}
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form className={classes.form} id="add_exam_form">
          <Stack spacing={3}>
            <Box
              spacing={1}
              component="div"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextField
                style={{ width: "43%" }}
                id="outlined-select-exam-type"
                select
                label="Exam Type"
                value={data.name}
                onChange={handleChange("name")}
                required
              >
                {exams.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ width: "43%" }}
                id="outlined-select-exam-type"
                select
                label="Year"
                value={data.year}
                onChange={handleChange("year")}
                required
              >
                {curYear.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              spacing={1}
              component="div"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns} required>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="dd/MM/yyyy"
                  value={date}
                  disablePast
                  style={{ width: "43%" }}
                  onChange={handleChange("date")}
                  renderInput={(params) => <TextField {...params} />}
                  required
                />
              </LocalizationProvider>
              <LocalizationProvider
                className={classes.elements}
                dateAdapter={AdapterDateFns}
                required
              >
                <TimePicker
                  required
                  label="Time"
                  value={time}
                  style={{ width: "43%" }}
                  onChange={handleChange("time")}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box
              component="div"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              spacing={1}
            >
              <TextField
                required
                style={{ width: "43%" }}
                id="outlined-required"
                label="Section"
                select
                value={data.section}
                onChange={handleChange("section")}
              >
                {sectionList.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ width: "43%" }}
                select
                id="outlined-required"
                label="Subject"
                value={data.subject}
                onChange={handleChange("subject")}
                required
              >
                {curSubjectList.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              component="div"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              spacing={1}
            >
              <TextField
                required
                id="outlined-required"
                label="Time Duration(Minutes)"
                style={{ width: "30%" }}
                value={data.duration}
                onChange={handleChange("duration")}
                required
              />
              <TextField
                required
                style={{ width: "30%" }}
                id="outlined-required"
                label="ObjMarks / Ques"
                value={data.objMarks}
                onChange={handleChange("objMarks")}
                required
              />
              <TextField
                required
                style={{ width: "30%" }}
                id="outlined-required"
                label="CodingMarks / Ques"
                value={data.codingMarks}
                onChange={handleChange("codingMarks")}
                required
              />
            </Box>
            <Box
              component="div"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              spacing={1}
            >
              <TextField
                required
                id="outlined-required"
                label="Objective Count"
                value={data.objectCount}
                style={{ width: "43%" }}
                onChange={handleChange("objectCount")}
                required
              />
              <TextField
                required
                id="outlined-required"
                label="Coding Count"
                className={classes.elements}
                value={data.codingCount}
                style={{ width: "43%" }}
                onChange={handleChange("codingCount")}
                required
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                const formId = document.getElementById("add_exam_form");
                formId.checkValidity();
                if (formId.reportValidity()) {
                  handleScheduleExam();
                  fetchCardDetails(facultyData._id, facultyData.role).then(
                    (res) => {
                      dispatch(loadExams(res.exams));
                    }
                  );
                }
              }}
            >
              Add Exam
            </Button>
          </Stack>
        </form>
      </Dialog>
    </div>
  );
}
