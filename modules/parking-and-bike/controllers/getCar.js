import prisma from "../../../core/db/prismaInstance.js";

const getCar = async (req, res) => {
    const { license_no } = req.params;

    try {
        const car = await prisma.$queryRaw`
            SELECT id
            FROM verified_car
            WHERE ${license_no} = license_no
        `;
        console.log(car);
        
        if (!car) {
            return res.status(400).json({ error: `Parking slot with ID ${license_no} does not exist.` });
        }

        res.json({
            message: "Verified!",
            car
        });

    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ error: "Error fetching car" });
    }
};

export { getCar };
