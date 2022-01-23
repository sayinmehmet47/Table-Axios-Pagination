import { useState } from "react";
import DatePicker from "react-datepicker";

export default function FilterComponent({ getGroupBy, getFrom, getTo }) {
  const [startDate, setStartDate] = useState(new Date("2020-01-10"));
  const [lastDate, setLastDate] = useState(new Date("2020-12-31"));

  const handleStartDate = (date) => {
    setStartDate(date);
    getFrom(date.toISOString().split("T")[0]);
    console.log(date.toISOString().split("T")[0]);
  };

  const handleLastDate = (date) => {
    setLastDate(date);
    getTo(date.toISOString().split("T")[0]);
  };

  return (
    <div className="d-flex flex-wrap ">
      {" "}
      <form action="" className="">
        <select
          onChange={(e) => getGroupBy(e.target.value)}
          className=" form-select-sm mt-3 me-2"
          aria-label="Default select example"
          style={{ minWidth: "80%" }}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </form>
      <div className="mt-2">
        <form className="" action="">
          {/* <label className="" htmlFor="startDate">
              Start
            </label> */}
          <DatePicker
            selected={startDate}
            dateFormat="yy/MM/dd"
            onChange={handleStartDate}
          />
        </form>
        <div className="">
          <form className="" action="">
            {/* <label htmlFor="lastDate" className="d-inline">
                LastDate
              </label> */}
            <DatePicker
              dateFormat="yy/MM/dd"
              selected={lastDate}
              onChange={(date) => handleLastDate(date)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
