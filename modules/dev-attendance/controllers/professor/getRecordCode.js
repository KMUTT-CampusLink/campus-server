import prisma from "../../../../core/db/prismaInstance.js";
import moment from "moment-timezone";

const getRecordCode = async (req, res) => {
  try {
    const { section_id } = req.params;
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

export default getRecordCode;
