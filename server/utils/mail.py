import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import env


async def sendMail(token: str, email: str):
    sender_email = env['EMAIL_ID']
    receiver_email = email
    subject = 'Embeddable Verification'
    message = f'<a href="{env['FRONTEND_URL']}/verify?token={
        token}">click here to verify</a>'

    smtp_server = 'smtp.gmail.com'
    smtp_port = 465
    username = env['EMAIL_ID']
    password = env['EMAIL_PASS']

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'html'))

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as smtp:
            smtp.login(username, password)
            smtp.send_message(msg)
            print('Email sent successfully.')

    except Exception as e:
        print(f'Error: {e}')
