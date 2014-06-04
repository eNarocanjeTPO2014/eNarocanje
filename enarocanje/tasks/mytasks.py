from celery import task
from django.core.mail import EmailMessage
from django.utils.encoding import smart_str
from twilio.rest import TwilioRestClient


@task.task(ignore_result=True)
def send_reminder_email(reservation_time, provider, service):

    reminder = "Danes ob "+str(reservation_time)+" imate rezervirano storitev " + smart_str(service) + " pri ponudniku "+ smart_str(provider)

    email = EmailMessage("Obvestilo o rezervaciji", reminder, to=["simonrakovic@gmail.com"])
    email.send()

@task.task(ignore_result=True)
def send_reminder_sms(reservation_time, provider, service):

    reminder = "Danes ob "+str(reservation_time)+" imate rezervirano storitev " + smart_str(service) + " pri ponudniku "+ smart_str(provider)

    account_sid = "ACef2eaf6a794fa87bd86043e49f45bc5a"
    auth_token = "f56f908ee006c0a03c89b39edd5ee88f"
    client = TwilioRestClient(account_sid, auth_token)
    message = client.messages.create(to="+38640682200", from_="+18027524980", body=reminder)
