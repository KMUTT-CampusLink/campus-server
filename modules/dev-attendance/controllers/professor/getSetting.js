import prisma from "../../../../core/db/prismaInstance.js";
import moment from "moment-timezone";

const getSetting = async (req, res) => {
  try {
    const { section_id } = req.params;

    // first check if there is a unique attendance id for the given section id
    let data = await prisma.dev_attendance.findFirst({
      where: {
        section_id: parseInt(section_id),
      },
    });

    if (!data) {
      // initialize a unique record for the given section id
      data = await prisma.dev_attendance.create({
        data: {
          section_id: parseInt(section_id),
          due_at: new Date(moment.utc() + 30 * 60 * 1000),
          expired_at: 30,
          late_after: 10,
          absent_after: 20,
          latitude: 0.0,
          longitude: 0.0,
        },
      });
    }

    return res.status(200).json({
      condition: "success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

export default getSetting;
