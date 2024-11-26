import prisma from "../../../core/db/prismaInstance.js";

const postHelp = async (req, res) => {
    const user = req.user 
    const { user_name, user_email, user_content } = req.body;

    try {

        const help = await prisma.parking_help.create({
            data: {
                user_id: user.id,
                name: user_name,
                email: user_email,
                content: user_content
            }
        });

        console.log("Create help request successfully!");
        res.json(help);

    } catch (error) {
        console.error("Error processing help:", error);
        res.status(400).json({ error: "Error processing help" });
    }
};

export { postHelp };