import prisma from "../../../core/db/prismaInstance.js";

const getAllLibraryAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.library_announcement.findMany()
    res.json(announcements)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching library announcements' })
  }
}

export { getAllLibraryAnnouncements };