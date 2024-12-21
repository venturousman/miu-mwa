type ParamsType = {
  first: number;
  second: number;
}

const addTwoNumbers = (params: ParamsType) => {
  return params.first + params.second;
};