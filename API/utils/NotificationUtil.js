const NotificationModel = require("../models/NotificationModel");

exports.createNotification = async (userId, title, content) => {
  const notification = new NotificationModel({ userId, title, content });
  await notification.save();
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is in the request object

    const notifications = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    }); // Sort notifications by creation date

    res.status(200).json({ notifications });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving notifications", error: err });
  }
};
