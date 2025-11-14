from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import datetime


def send_verification_email(user, verification_token):
    """
    Send email verification email to the user
    
    Args:
        user: User instance
        verification_token: The verification token to include in the email
    """
    try:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        verification_link = f"{frontend_url}/verify-email?token={verification_token}"
        
        subject = 'Verify Your Email Address - Vehicle Posting Site'
        
        # Create beautiful HTML email content
        html_message = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                        🚗 Welcome!
                                    </h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                        Verify Your Email Address
                                    </h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Hello <strong style="color: #1f2937;">{user.name or user.email}</strong>,
                                    </p>
                                    
                                    <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                        Thank you for registering with us! To complete your registration and start posting vehicles, please verify your email address by clicking the button below.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td align="center" style="padding: 0;">
                                                <a href="{verification_link}" 
                                                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3); transition: all 0.3s ease;">
                                                    ✉️ Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Alternative Link -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td style="background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px;">
                                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">
                                                    Or copy and paste this link:
                                                </p>
                                                <p style="margin: 0; word-break: break-all; color: #7c3aed; font-size: 13px; font-family: monospace;">
                                                    {verification_link}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Important Note -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                                    <strong>⏰ Important:</strong> This verification link will expire in <strong>1 hour</strong>. If you didn't create an account, please ignore this email.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                        Need help? Contact our support team.
                                    </p>
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        This is an automated message. Please do not reply to this email.
                                    </p>
                                    <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                                        © {datetime.date.today().year} Vehicle Posting Site. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        # Plain text version (for email clients that don't support HTML)
        plain_message = f"""
        Welcome to Vehicle Posting Site!
        
        Hello {user.name or user.email},
        
        Thank you for registering with us! To complete your registration and start posting vehicles, please verify your email address by clicking the link below:
        
        {verification_link}
        
        IMPORTANT: This verification link will expire in 1 hour.
        
        If you didn't create an account, please ignore this email.
        
        ---
        This is an automated message. Please do not reply to this email.
        © {datetime.date.today().year} Vehicle Posting Site. All rights reserved.
        """
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending verification email: {str(e)}")
        return False

