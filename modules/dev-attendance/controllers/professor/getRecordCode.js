import prisma from "../../../../core/db/prismaInstance.js";
import moment from "moment-timezone";
import { encrypt } from "../../utils/secureCode.js";

const getRecordCode = async (req, res) => {
  try {
    const { section_id } = req.params;
    /**
     * How to create the encrypted valid code:
     * I need to make sure that the due date must be within the expired time
     */
    const attend_data = await prisma.dev_attendance.findFirst({
      where: {
        section_id: parseInt(section_id),
        due_at: {
          gt: moment().utc(),
        },
      },
    });

    if (attend_data) {
      const encryptedCode = encrypt(
        `${attend_data.id}%%${attend_data.section_id}`
      );
      const data = {
        code: encryptedCode,
        due: Math.abs(moment().utc().diff(attend_data.due_at, "minutes")),
      };

      return res.status(200).json({
        condition: "success",
        data: data,
      });
    }

    return res.status(200).json({
      condition: "success",
      data: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

export default getRecordCode;
