import axios from "axios";

export default (subject, year) => {
  const url =
    "https://dix7hohrul.execute-api.ap-northeast-1.amazonaws.com/default/naverAPImovie";

  const params = {};
  params["SUBJECT"] = subject;
  params["YEAR"] = year;

  const axiosConfig = {
    method: "get",
    params: params,
    url: url,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios.get(url, axiosConfig).then(response => {
    if (
      response.status === 200 &&
      response &&
      typeof response.data !== "undefined" &&
      typeof response.data.items[0] !== "undefined" &&
      typeof response.data.items[0]["link"] !== "undefined"
    ) {
      const link = response.data.items[0]["link"];
      return link;
    }
  });
};
