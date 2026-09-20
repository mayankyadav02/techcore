# Email & Notifications

## Integration
TechCore uses **Resend** for transactional email delivery.

## Implementation
Centralized in `modules/notifications/email.service.ts`.

## Email Types
The system generates HTML emails for:
- **Contact Enquiries**: Notifies admin and sends a receipt to the customer.
- **Quote Requests**: Notifies admin and sends a receipt to the customer.
- **Job Applications**: Notifies admin and sends a receipt to the applicant.
- **Password Reset**: OTP delivery for admin password recovery.
- **Test Email**: Admin functionality to verify Resend configuration.

## Recipient Routing
- **Customer**: Sent to the email provided in the form.
- **Admin**: Sent to the email configured in the CMS `Settings` model. If not configured, it falls back to the `ADMIN_EMAIL` environment variable.

## Resilience & Error Handling
- The `dispatchCustomerAndAdminEmails` function sends both emails concurrently.
- It includes a built-in retry mechanism (up to 3 attempts with exponential backoff) for transient errors (Timeouts, Rate Limits, 5xx responses).
- Permanent errors (e.g., rejected by Resend) are caught and logged, preventing the main user action (like form submission) from crashing due to an email delivery failure. 
- **No strict delivery guarantees** are promised to the end-user. 

## Environment Variables
- `RESEND_API_KEY`: Required for delivery.
- `EMAIL_FROM`: The verified sender address in Resend.
- `ADMIN_EMAIL`: Fallback recipient for system notifications.
