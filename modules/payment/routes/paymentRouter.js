import { Router } from "express";
// import your logics from controllers here
import { getAllInvoice } from "../controller/getAllInvoice.js";
import { connectPaymentGateway } from "../controller/ConnectStripe/connectPaymentGateway.js";
import { verifyCheckoutSession } from "../controller/ConnectStripe/verifyCheckoutSession.js"; 
import { verifyPaymentStatus } from "../controller/verifyPaymentStatus.js";
import { createInstallmentPlan } from "../controller/Installments/createInstallmentPlan.js";
import { viewInstallmentDetails } from "../controller/Installments/viewInstallmentDetails.js";
import { installmentPreview  } from "../controller/Installments/installmentPreview.js";
import { getInvoiceInfo } from "../controller/getInvoiceInfo.js";

const paymentRouter = Router();

paymentRouter.get("/invoice", async (req, res) => {
  try {
    await getAllInvoice(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


paymentRouter.post("/pay", (req, res) => {
  const { inv, ins } = req.body;
  if (inv) {
    try {
      connectPaymentGateway(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (ins) {
    try {
      connectPaymentGateway(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID or Installment ID is required" });
  }
});

// เพิ่มเส้นทางสำหรับ verifyCheckoutSession
paymentRouter.get("/verify-session", async (req, res) => {
  const { session_id } = req.query; // รับ session_id จาก query parameters
  if (session_id) {
    try {
      await verifyCheckoutSession(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Session ID is required" });
  }
});

// เพิ่มเส้นทางสำหรับ verifyPaymentStatus
paymentRouter.get("/verify/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params; // รับ invoiceId จาก URL parameter
  if (invoiceId) {
    try {
      await verifyPaymentStatus(req, res); // เรียกใช้ฟังก์ชัน verifyPaymentStatus
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID is required" });
  }
});

// เพิ่มเส้นทางสำหรับการผ่อนชำระ
paymentRouter.post("/installment/:invoiceId/:numInstallments", async (req, res) => {
  const { invoiceId, numInstallments } = req.params; // รับค่า invoiceId และจำนวนครั้งการผ่อนชำระจาก URL parameter

  if (invoiceId && (numInstallments === "2" || numInstallments === "3")) {
    try {
      await createInstallmentPlan(req, res); // เรียกใช้ฟังก์ชัน createInstallmentPlan
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID and valid installment number (2 or 3) are required" });
  }
});

// เพิ่มเส้นทางสำหรับดูรายละเอียดการผ่อนชำระ
paymentRouter.get("/viewInstallment/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params; // รับค่า invoiceId จาก URL parameter
  if (invoiceId) {
    try {
      await viewInstallmentDetails(req, res); // เรียกใช้ฟังก์ชัน viewInstallmentDetails
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID is required" });
  }
});

// เพิ่มเส้นทางสำหรับพรีวิวการผ่อนชำระ
paymentRouter.get("/installmentPreview/:invoiceId/:numInstallments", async (req, res) => {
  const { invoiceId, numInstallments } = req.params; // รับค่า invoiceId และจำนวนครั้งการผ่อนชำระจาก URL parameter
  if (invoiceId && (numInstallments === "2" || numInstallments === "3")) {
    try {
      await installmentPreview(req, res); // เรียกใช้ฟังก์ชัน installmentPreview
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID and valid installment number (2 or 3) are required" });
  }
});

paymentRouter.get("/invoiceInfo/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params; // รับค่า invoiceId จาก URL parameter
  if (invoiceId) {
    try {
      await getInvoiceInfo(req, res); // เรียกใช้ฟังก์ชัน getInvoiceInfo
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invoice ID is required" });
  }
});

paymentRouter.get("/", (req, res) => {
  return res.send("Payment");
});

export { paymentRouter };
