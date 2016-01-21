/* проверка является строка числом */
function isNumber (strIn) {
  return (typeof(strIn) === "number") && isFinite(strIn);
};

/* сумма элементов массива */
function sumArrElements(arr) {
  var result = 0;
  for (var i=0; i<arr.length; i++) {
    result += arr[i];
  };
  return result;
};

/* сумма произведений соответствующих элементов двух массивов */
function multiple2ArrElements(arr1, arr2) {
  var result = 0;
  for (var i=0; i<arr1.length && i<arr2.length; i++) {
    result += arr1[i] * arr2[i];
  };
  return result;
};

/* решение задачи 1.5 */
function getMessage (a, b) {
  if (typeof(a) === "boolean") {
    return a ? "Я попал в " + b : "Я никуда не попал";
  } else if (isNumber(a)) {
    return "Я прыгнул на " + a * 100 + " сантиметров";
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return "Я прошёл " + multiple2ArrElements(a, b) + " метров"
  } else if (Array.isArray(a)) {
    return "Я прошёл " + sumArrElements(a) + " шагов";
  }
};
