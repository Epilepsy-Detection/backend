const api = require("../instances/machineLearningServer");
const AppError = require("ep-det-core/utils/AppError");

module.exports.predict = async (data) => {
  try {
    const response = await api.post("/predict", {
      data: data,
    });

    return response.data;
  } catch (e) {
    throw new AppError(e, 400);
  }
};
