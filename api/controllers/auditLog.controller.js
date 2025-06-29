// // controllers/auditLogController.js
// import prisma from "../lib/prisma.js";

// export const getAuditLogs = async (req, res) => {
//   try {
//     const logs = await prisma.auditLog.findMany({
//       include: {
//         user: {
//           select: { id: true, username: true, email: true },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     res.status(200).json(logs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch audit logs" });
//   }
// };
import prisma from "../lib/prisma.js";

// export const getAuditLogs = async (req, res) => {
//   try {
//     const logs = await prisma.auditLog.findMany({
//       include: {
//         user: {
//           select: { id: true, username: true, email: true },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const targetIds = [...new Set(logs.map(log => log.targetId).filter(id => id !== null))];

//     const targetUsers = await prisma.user.findMany({
//       where: { id: { in: targetIds } },
//       select: { id: true, username: true, email: true },
//     });

//     const targetUserMap = new Map(targetUsers.map(u => [u.id, u]));

//     const logsWithMessages = logs.map(log => {
//       let msg = log.message || "";

//       // Vetëm zëvendëso targetId me emrin e targetUser
//       if (log.targetId && targetUserMap.has(log.targetId)) {
//         const targetUser = targetUserMap.get(log.targetId);
//         msg = msg.replace(
//           log.targetId,
//           `${targetUser.username} (${targetUser.email})`
//         );
//       }

//       return { ...log, message: msg };
//     });

//     res.status(200).json(logsWithMessages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch audit logs" });
//   }
// };
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Merrim të gjitha targetIds unike që nuk janë null
    const targetIds = [...new Set(logs.map(log => log.targetId).filter(id => id !== null))];

    // Marrim të dhënat e përdoruesve target
    const targetUsers = await prisma.user.findMany({
      where: { id: { in: targetIds } },
      select: { id: true, username: true, email: true },
    });

    const targetUserMap = new Map(targetUsers.map(u => [u.id, u]));

    // Formëso mesazhet e plota
    const logsWithMessages = logs.map(log => {
      const actor = log.user ? `${log.user.username}` : "Useri i panjohur";
      let targetInfo = "";

      if (log.targetId && targetUserMap.has(log.targetId)) {
        const target = targetUserMap.get(log.targetId);
        targetInfo = `${target.username} (${target.email})`;
      } else if (log.targetId) {
        // Nëse target nuk është përdorues, mund ta shfaqësh si id thjesht
        targetInfo = log.targetId;
      }

      // Formëso mesazhin bazuar në action
      let fullMessage = "";

      switch (log.action) {
        case "CREATE_POST":
          fullMessage = `${actor} created post ${targetInfo}`;
          break;
        case "UPDATE_POST":
          fullMessage = `${actor} updated post ${targetInfo}`;
          break;
        case "DELETE_POST":
          fullMessage = `${actor}  deleted post ${targetInfo}`;
          break;
        case "UPDATE_USER":
          fullMessage = `${actor} updated user ${targetInfo}`;
          break;
        case "DELETE_USER":
          fullMessage = `${actor} deleted user ${targetInfo}`;
          break;
        default:
          // Nëse veprimi nuk është i njohur, trego thjesht action + target
          fullMessage = `${actor} made ${log.action} on ${targetInfo}`;
      }

      return { ...log, message: fullMessage };
    });

    res.status(200).json(logsWithMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

export const deleteAuditLogs = async (req, res) => {
  try {
    // Për shembull, fshin TË GJITHA audit logs
    await prisma.auditLog.deleteMany();

    res.status(200).json({ message: "Audit logs deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete audit logs" });
  }
};
// controller
export const deleteAuditLogById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLog = await prisma.auditLog.delete({
      where: { id },
    });
    res.status(200).json({ message: "Audit log deleted successfully", deletedLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete audit log" });
  }
};


