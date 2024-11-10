import prisma from "../../../core/db/prismaInstance.js";

export const getMemberByClubId = async (req, res) => {
    const { clubId } = req.params;

    try{
        const members = await prisma.club_member.findMany({
            where: {
                club_id: parseInt(clubId),
            },
            select: {
                club_id: true,
                student: {
                    select: {
                        id: true,
                        firstname: true,
                        midname: true,
                        lastname: true,
                    },
                },
                employee: {
                    select: {
                        id: true,
                        firstname: true,
                        midname: true,
                        lastname: true,
                    },
                },
                is_admin: true,
                status: true,
            }
    });
    return res.status(200).json({ success: true, data: members });
    }
    catch (error) {
        console.error("Failed to fetch members:", error);
        return res
        .status(500)
        .json({ success: false, message: "Failed to fetch members" });
    }
}
