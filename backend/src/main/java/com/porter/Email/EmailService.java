package com.porter.Email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.porter.model.Delivery;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender emailSender;

    @Async
    public void sendEmail(String recipientEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); 

            emailSender.send(message);
            logger.info("Email sent successfully to: {}", recipientEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send email to {}: {}", recipientEmail, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendDeliveryBookedEmail(Delivery delivery) {
        String subject = "Your Delivery is Booked!";
        String content = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>"
            + "<div style='text-align: center; position: relative;'>"
            + "<img src='https://i.imgur.com/1Q9Z1Zm.png' alt='Booked Stamp' style='position:absolute;top:10px;right:10px;width:90px;opacity:0.8;z-index:2;' />"
            + "<img src='data:image/png;base64,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' alt='Booked Truck' width='50' height='50' style='margin-bottom:10px;' />"
            + "<h2 style='color: #007bff; margin-bottom: 10px;'>Delivery Booked!</h2>"
            + "</div>"
            + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
            + "<p style='font-size: 15px; color: #555;'>Your delivery (ID: %d) has been successfully booked. Here are your delivery details:</p>"
            + "<table style='width:100%%;margin:20px 0;border-collapse:collapse;'>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Pickup Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Delivery Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Package Type:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Weight:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s kg</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Scheduled Time:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Amount:</td><td style='padding:8px;border-bottom:1px solid #eee;'>₹%s</td></tr>"
            + "</table>"
            + "<p style='font-size: 14px; color: #666;'>Thank you for using PORTER▸XPRESSO!</p>"
            + "</div>",
            delivery.getUser().getUsername(),
            delivery.getId(),
            delivery.getPickupLocation() != null ? delivery.getPickupLocation().getAddress() : "-",
            delivery.getDeliveryLocation() != null ? delivery.getDeliveryLocation().getAddress() : "-",
            delivery.getPackageType() != null ? delivery.getPackageType().toString() : "-",
            delivery.getPackageWeight() != null ? delivery.getPackageWeight().toString() : "-",
            delivery.getScheduledTime() != null ? delivery.getScheduledTime().toString() : "-",
            delivery.getAmount() != null ? delivery.getAmount().toString() : "-"
        );
        sendEmail(delivery.getUser().getEmail(), subject, content);
    }

    @Async
    public void sendDeliveryStatusEmail(Delivery delivery, String status) {
        String subject = "Delivery Status Update: " + status;
        String content = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>"
            + "<div style='text-align: center;'>"
            + "<img src='https://cdn-icons-png.flaticon.com/512/2344/2344094.png' alt='Status' width='50' height='50' />"
            + "<h2 style='color: #007bff; margin-bottom: 10px;'>Delivery Status Update</h2>"
            + "</div>"
            + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
            + "<p style='font-size: 15px; color: #555;'>Your delivery (ID: %d) status has changed to <strong>%s</strong>.</p>"
            + "<table style='width:100%%;margin:20px 0;border-collapse:collapse;'>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Pickup Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Delivery Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Package Type:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Weight:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s kg</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Scheduled Time:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Amount:</td><td style='padding:8px;border-bottom:1px solid #eee;'>₹%s</td></tr>"
            + "</table>"
            + "<p style='font-size: 14px; color: #666;'>Track your order for more details.</p>"
            + "<p style='font-size: 14px; color: #666;'>Thank you for using PORTER▸XPRESSO!</p>"
            + "</div>",
            delivery.getUser().getUsername(),
            delivery.getId(),
            status,
            delivery.getPickupLocation() != null ? delivery.getPickupLocation().getAddress() : "-",
            delivery.getDeliveryLocation() != null ? delivery.getDeliveryLocation().getAddress() : "-",
            delivery.getPackageType() != null ? delivery.getPackageType().toString() : "-",
            delivery.getPackageWeight() != null ? delivery.getPackageWeight().toString() : "-",
            delivery.getScheduledTime() != null ? delivery.getScheduledTime().toString() : "-",
            delivery.getAmount() != null ? delivery.getAmount().toString() : "-"
        );
        sendEmail(delivery.getUser().getEmail(), subject, content);
    }

    @Async
    public void sendInvoiceEmail(Delivery delivery, String amount, String paymentMethod) {
        String subject = "Invoice for Delivery #" + delivery.getId();
        String content = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>"
            + "<div style='text-align: center; position: relative;'>"
            + "<img src='https://st.depositphotos.com/34584522/57983/v/450/depositphotos_579839128-stock-illustration-paid-red-rubber-stamp-vector.jpg' alt='Paid' style='position:absolute;top:10px;right:10px;width:90px;opacity:0.8;z-index:2;' />"
            + "<img src='https://cdn-icons-png.flaticon.com/512/2344/2344094.png' alt='Invoice' width='50' height='50' style='margin-bottom:10px;' />"
            + "<h2 style='color: #007bff; margin-bottom: 10px;'>Payment Invoice</h2>"
            + "</div>"
            + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
            + "<p style='font-size: 15px; color: #555;'>Thank you for your payment for delivery (ID: %d).</p>"
            + "<table style='width:100%%;margin:20px 0;border-collapse:collapse;'>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Pickup Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Delivery Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Package Type:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Weight:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s kg</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Scheduled Time:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Amount:</td><td style='padding:8px;border-bottom:1px solid #eee;'>₹%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Payment Method:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "</table>"
            + "<p style='font-size: 14px; color: #666;'>You can track your order for more details.</p>"
            + "<p style='font-size: 14px; color: #666;'>Thank you for using PORTER▸XPRESSO!</p>"
            + "</div>",
            delivery.getUser().getUsername(),
            delivery.getId(),
            delivery.getPickupLocation() != null ? delivery.getPickupLocation().getAddress() : "-",
            delivery.getDeliveryLocation() != null ? delivery.getDeliveryLocation().getAddress() : "-",
            delivery.getPackageType() != null ? delivery.getPackageType().toString() : "-",
            delivery.getPackageWeight() != null ? delivery.getPackageWeight().toString() : "-",
            delivery.getScheduledTime() != null ? delivery.getScheduledTime().toString() : "-",
            amount,
            paymentMethod
        );
        sendEmail(delivery.getUser().getEmail(), subject, content);
    }

    @Async
    public void sendUnpaidBillEmail(Delivery delivery, String amount) {
        String subject = "Unpaid Bill for Delivery #" + delivery.getId();
        String content = String.format(
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fffbe6; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);'>"
            + "<div style='text-align: center; position: relative;'>"
            + "<img src='https://t3.ftcdn.net/jpg/04/87/13/44/360_F_487134492_svhGzEgDXKyQuuPXQrs7prKoBYWCEJdw.jpg' alt='Unpaid' style='position:absolute;top:10px;right:10px;width:90px;opacity:0.8;z-index:2;' />"
            + "<img src='https://cdn-icons-png.flaticon.com/512/2344/2344094.png' alt='Unpaid' width='50' height='50' style='margin-bottom:10px;' />"
            + "<h2 style='color: #dc3545; margin-bottom: 10px;'>Unpaid Bill</h2>"
            + "</div>"
            + "<p style='font-size: 16px; color: #333;'>Dear <strong>%s</strong>,</p>"
            + "<p style='font-size: 15px; color: #555;'>Your delivery (ID: %d) has been delivered. Please pay the outstanding amount: <strong>₹%s</strong>.</p>"
            + "<table style='width:100%%;margin:20px 0;border-collapse:collapse;'>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Pickup Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Delivery Address:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Package Type:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Weight:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s kg</td></tr>"
            + "<tr><td style='padding:8px;border-bottom:1px solid #eee;'>Scheduled Time:</td><td style='padding:8px;border-bottom:1px solid #eee;'>%s</td></tr>"
            + "</table>"
            + "<p style='font-size: 14px; color: #666;'>You can pay your bill from your dashboard.</p>"
            + "<p style='font-size: 14px; color: #666;'>Thank you for using PORTER▸XPRESSO!</p>"
            + "</div>",
            delivery.getUser().getUsername(),
            delivery.getId(),
            amount,
            delivery.getPickupLocation() != null ? delivery.getPickupLocation().getAddress() : "-",
            delivery.getDeliveryLocation() != null ? delivery.getDeliveryLocation().getAddress() : "-",
            delivery.getPackageType() != null ? delivery.getPackageType().toString() : "-",
            delivery.getPackageWeight() != null ? delivery.getPackageWeight().toString() : "-",
            delivery.getScheduledTime() != null ? delivery.getScheduledTime().toString() : "-"
        );
        sendEmail(delivery.getUser().getEmail(), subject, content);
    }
}