import prisma from "../../../../core/db/prismaInstance.js";
import moment from "moment-timezone";

const updateSetting = async (req, res) => {
  try {
    const { section_id } = req.params;
    const data = req.body;

    // update the record for the given section id
    await prisma.dev_attendance.update({
      where: {
        section_id: parseInt(section_id),
      },
      data: {
        due_at: new Date(moment.utc() + parseInt(data.expire) * 60 * 1000),
        expired_at: parseInt(data.expire),
        late_after: parseInt(data.late),
        absent_after: parseInt(data.absent),
        latitude: data.lat,
        longitude: data.long,
        use_location: data.location,
      },
    });

    return res.status(200).json({
      condition: "success",
      data: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

export default updateSetting;
