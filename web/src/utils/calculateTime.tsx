import React from "react";


// interface calculateTimeprops {
//     secs: number;
//   }

export const calculateTime = (secs: number ) => {
    if (secs == null) {
      return `00:00:00`;
    }
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    const returnedHours = hours < 10 ? `0${hours}` : `${hours}`;

    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedHours}:${returnedMinutes}:${returnedSeconds}`;
  };