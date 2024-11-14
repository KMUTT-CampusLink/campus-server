import prisma from "../../../core/db/prismaInstance.js";

const getCar = async (req, res) => {
    const { license_no } = req.params;

    try {
        const car = await prisma.verified_car.findUnique({
            where: { license_no }
        });

         // if there is -true if there isn't -false
         res.json({ verified: !!car });

    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ error: "Error fetching car" });
    }
};

export { getCar };
