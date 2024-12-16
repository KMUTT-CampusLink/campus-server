import prisma from "../../../core/db/prismaInstance.js";

const postRegisterCar = async (req, res) => {
  const user = req.user
  const { name, license_no } = req.body;

  try {
    const existingCar = await prisma.verified_car.findFirst({
      where: {
        OR: [{ user_id: user.id }, { license_no: license_no }],
      },
    });

    if (existingCar) {
      if (existingCar.user_id === user.id) {
        return res
          .status(400)
          .json({ error: "Each user can only register one car." });
      } else if (existingCar.license_no === license_no) {
        return res
          .status(400)
          .json({ error: "This license number is already registered." });
      }
    }

    const car = await prisma.verified_car.create({
      data: {
        user_id: user.id,
        license_no: license_no,
      },
    });

    res.json({
      message: "Register Car successfully!",
      user_id: user.id,
      name: name,
      car_id: car.car_id,
      license_no: license_no,
    });
  } catch (error) {
    console.error("Error processing register car:", error);
    res.status(500).json({ error: "Error processing register car" });
  }
};

export { postRegisterCar };
